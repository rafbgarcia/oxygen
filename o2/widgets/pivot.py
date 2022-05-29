from curses import has_key
from sqlalchemy import table, column, select, func, cast, Float
from sqlalchemy.dialects import postgresql

from o2.dataset import dataset_execute

CONTRIBUTION = "CONTRIBUTION"


class Pivot:
    def __init__(self, build_info, dataset):
        self.build_info = build_info
        self.dataset = dataset

        columns = [column(field["name"]) for field in self.dataset["fields"]]
        self.table = table(self.dataset["name"], *columns)
        self.row_fields = build_info["rows"]
        self.column_fields = build_info["columns"]
        self.rows = self.__as_columns(build_info["rows"])
        self.columns = self.__as_columns(build_info["columns"])
        self.aggregations = self.__build_measure_columns(
            [field for field in build_info["values"] if not "function" in field]
        )
        self.contribution_fields = [
            field for field in build_info["values"] if field.get("function") == CONTRIBUTION
        ]

    def metadata(self, limit=25, offset=0):
        pivot = self.build()
        if len(self.columns) > 0:
            pivot = pivot.swaplevel(0, len(self.columns), axis="columns").sort_index(axis="columns")

        return {"html": pivot.to_html(escape=False, na_rep="-", index_names=True)}

    def build(self):
        query = self.build_sql()
        rows = [field["alias"] for field in self.build_info["rows"]]
        values = [field["alias"] for field in self.build_info["values"]]
        columns = [field["alias"] for field in self.build_info["columns"]]
        df = dataset_execute(self.dataset["name"], query)
        pivot = df.pivot(columns=columns, values=values, index=rows).fillna("-")

        return pivot

    def build_sql(self):
        select_fields = [
            getattr(self.table.c, field["name"]).label(field["alias"])
            for field in self.row_fields + self.column_fields
        ]
        select_fields += self.aggregations
        groupby = self.rows
        if len(self.contribution_fields) > 0:
            cte = self.__totals_cte()
            groupby += self.columns
            for field in self.contribution_fields:
                col = self.__build_measure_column(field)
                select_fields.append(
                    (col / func.max(getattr(cte.c, self.__fn_field_label(field)))).label(field["alias"])
                )

        query = select(*select_fields).group_by(*groupby)

        return str(query.compile(dialect=postgresql.dialect()))

    def __totals_cte(self):
        # WITH grouped_totals AS (
        #     SELECT follow_up_result, resulted_by, COUNT(DISTINCT application_id) AS total
        #     FROM {table}
        #     GROUP BY follow_up_result, resulted_by
        # ),
        # totals AS (
        #     SELECT follow_up_result, SUM(total) as total FROM grouped_totals
        #     GROUP BY follow_up_result
        # )

        contribs = [
            self.__build_measure_column(field).label(self.__fn_field_label(field))
            for field in self.contribution_fields
        ]
        cte = select(*self.rows, *contribs).group_by(*self.rows).cte()

        rows = [getattr(cte.c, field["name"]) for field in self.row_fields[0:-1]]
        contribs2 = [
            cast(func.sum(getattr(cte.c, self.__fn_field_label(field))), Float).label(
                self.__fn_field_label(field)
            )
            for field in self.contribution_fields
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
