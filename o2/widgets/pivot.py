from curses import has_key
from sqlalchemy import table, column, select, func, cast, Float
from sqlalchemy.dialects import postgresql

from o2.dataset import dataset_execute


def contribution():
    pass


CONTRIBUTION = "CONTRIBUTION"
NEED_CTE_FUNCTIONS = [CONTRIBUTION]
AGG_FN = {
    "COUNT DISTINCT": lambda col: func.count(func.distinct(col)),
    "COUNT": lambda col: func.count(col),
    "SUM": lambda col: func.sum(col),
}
FUNCTION_FN = {"CONTRIBUTION": contribution}


def define_table(dataset):
    columns = [column(field["name"]) for field in dataset["fields"]]
    return table(dataset["name"], *columns)


def need_cte(field):
    return "function" in field and field["function"] in NEED_CTE_FUNCTIONS


def aliased_col(table, field):
    return getattr(table.c, field["name"]).label(field["alias"])


def table_cols(table, fields):
    return [table_col(table, field) for field in fields]


def table_col(table, field):
    return getattr(table.c, field["name"])


def build_agg(table, field):
    if field["agg"] not in AGG_FN:
        raise ValueNotSupported("Aggregation", field["agg"])

    return AGG_FN[field["agg"]](table_col(table, field)).label(field["alias"])


class Pivot:
    def __init__(self, build_info, dataset):
        self.build_info = build_info
        self.dataset = dataset

        self.table = define_table(dataset)
        self.values = build_info["values"]
        #
        #
        self.row_fields = build_info["rows"]
        self.column_fields = build_info["columns"]
        self.rows = self.__as_columns(build_info["rows"])
        self.columns = self.__as_columns(build_info["columns"])
        self.function_fields = [field for field in build_info["values"] if need_cte(field)]

    def metadata(self, limit=25, offset=0):
        pivot = self.build()
        if len(self.columns) > 0:
            pivot = pivot.swaplevel(0, len(self.columns), axis="columns").sort_index(axis="columns")

        return {"html": pivot[offset:limit].to_html(escape=False, na_rep="-", index_names=True)}

    def build(self):
        query = self.build_sql()
        rows = [field["alias"] for field in self.build_info["rows"]]
        values = [field["alias"] for field in self.build_info["values"]]
        columns = [field["alias"] for field in self.build_info["columns"]]
        df = dataset_execute(self.dataset["name"], query)
        pivot = df.pivot(columns=columns, values=values, index=rows).fillna("-")

        return pivot

    def build_sql(self):
        non_function_cols = [build_agg(self.table, field) for field in self.values if not need_cte(field)]
        # function_cols =
        select_fields = [
            aliased_col(self.table, field) for field in self.row_fields + self.column_fields
        ] + non_function_cols

        groupby = table_cols(self.table, self.row_fields)
        if len(self.function_fields) > 0:
            cte = self.__totals_cte()
            groupby += table_cols(self.table, self.column_fields)

            for field in self.function_fields:
                col = self.__build_measure_column(field)
                select_fields.append(
                    (col / func.max(getattr(cte.c, self.__fn_field_label(field)))).label(field["alias"])
                )

        query = select(*select_fields).group_by(*groupby).order_by(*groupby)

        return str(query.compile(dialect=postgresql.dialect()))

    def __totals_cte(self):
        contribs = [
            self.__build_measure_column(field).label(self.__fn_field_label(field))
            for field in self.function_fields
        ]
        cte = select(*self.rows, *contribs).group_by(*self.rows).cte()

        rows = [getattr(cte.c, field["name"]) for field in self.row_fields[0:-1]]
        contribs2 = [
            cast(func.sum(getattr(cte.c, self.__fn_field_label(field))), Float).label(
                self.__fn_field_label(field)
            )
            for field in self.function_fields
        ]
        c = select(*rows, *contribs2).group_by(*rows).cte()
        return c

    def __build_measure_column(self, field):
        column = self.__get_table_column(field)
        agg = field["agg"]
        alias = field["alias"]

        if agg == "COUNT DISTINCT":
            return func.count(func.distinct(column)).label(alias)
        elif agg == "COUNT":
            return func.count(column).label(alias)
        elif agg == "SUM":
            return func.sum(column).label(alias)
        else:
            raise ValueNotSupported("Aggregation", agg)

    def __select_values(self):
        select_fields = list()
        for value in self.build_info["values"]:
            column = self.__build_measure_columns(value)
            if not has_key(value, "function"):
                pass
            elif value["function"] == "CONTRIBUTION":
                # ROUND(COUNT(DISTINCT application_id) / CAST(MAX(t.total) AS FLOAT) * 100, 2) as "%"
                pass
            else:
                raise ValueNotSupported("Function", value["function"])

            select_fields.append(column)

        return select_fields

    def __fn_field_label(self, field):
        return field["function"] + "_" + field["name"]

    def __select_columns(self):
        rows = [column(item["field"]).label(item["alias"]) for item in self.build_info["rows"]]
        columns = [column(item["field"]).label(item["alias"]) for item in self.build_info["columns"]]
        return rows + columns + self.__select_values()

    def __get_table_column(self, field):
        return getattr(self.table.c, field["name"])

    def __as_columns(self, fields):
        return [self.__get_table_column(field) for field in fields]

    def __build_measure_columns(self, fields):
        return [self.__build_measure_column(field) for field in fields]

    def __sql_for_reference(self):
        sql = """
        WITH grouped_totals AS (
            SELECT follow_up_result, COUNT(DISTINCT application_id) AS total
            FROM followups
            WHERE follow_up_date >= '2022-01-01'
            GROUP BY follow_up_result
        ),

        totals AS (
            SELECT SUM(total) as total FROM grouped_totals
        )

        SELECT
            f.follow_up_result,
            COUNT(DISTINCT application_id) AS "#",
            MAX(t.total),
            ROUND(COUNT(DISTINCT application_id) / CAST(MAX(t.total) AS FLOAT) * 100, 2) as "%"
        FROM followups f
        LEFT JOIN totals t ON 1 = 1
        WHERE f.follow_up_date >= '2022-01-01'
        GROUP BY follow_up_result
        """


class ValueNotSupported(Exception):
    def __init__(self, type, value):
        self.type = type
        self.value = value

    def __str__(self):
        return f"{self.type} {self.value}"


def debug(arg):
    print("-------------------")
    print(arg)
    print("-------------------")
