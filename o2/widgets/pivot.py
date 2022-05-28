from itertools import groupby
from sqlalchemy import table, column, select, func
from sqlalchemy.dialects import postgresql

from o2.dataset import dataset_execute


class Pivot:
    def __init__(self, build_info, dataset):
        self.build_info = build_info
        self.dataset = dataset

    def build(self, limit=25, offset=0):
        query = self.build_sql()
        rows = [field["alias"] for field in self.build_info["rows"]]
        values = [field["alias"] for field in self.build_info["values"]]
        columns = [field["alias"] for field in self.build_info["columns"]]
        df = dataset_execute("test", query)
        df = (
            df.pivot(columns=columns, values=values, index=rows)
            # .stack(level=0)
            # .T
            [offset:limit]
        )

        return df.to_html(escape=False, na_rep="-", index_names=True)

    def select_values(self, dataset_table):
        select_fields = list()
        for value in self.build_info["values"]:
            col = getattr(dataset_table.c, value["field"])

            if value["function"] == "COUNT DISTINCT":
                field = func.count(func.distinct(col)).label(value["alias"])
            elif value["function"] == "COUNT":
                field = func.count(col).label(value["alias"])
            elif value["function"] == "CONTRIBUTION":
                field = func.count(col).label(value["alias"])

            select_fields.append(field)

        return select_fields

    def select_columns(self, dataset_table):
        rows = [column(item["field"]).label(item["alias"]) for item in self.build_info["rows"]]
        columns = [column(item["field"]).label(item["alias"]) for item in self.build_info["columns"]]
        return rows + columns + self.select_values(dataset_table)

    def build_sql(self):
        columns = [column(field["name"]) for field in self.dataset["fields"]]
        dataset_table = table(self.dataset["name"], *columns)

        select_fields = self.select_columns(dataset_table)
        group_by = [getattr(dataset_table.c, row["field"]) for row in self.build_info["rows"]]
        query = select(*select_fields).group_by(*group_by)

        return str(query.compile(dialect=postgresql.dialect()))

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
