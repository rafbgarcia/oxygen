from tokenize import String
import pandas as pd
import pantab
from o2.models import Dashboard
from sqlalchemy import Integer, MetaData, table, column, select, true, Table, Column, func
from sqlalchemy.dialects import postgresql


class Pivot:
    def __init__(self, build_info, dataset):
        self.build_info = build_info
        self.dataset = dataset

    def build(self):
        q = Pivot.__build_sql()

        df = pantab.frame_from_hyper_query("/Users/rafa/Downloads/test_follow_ups.hyper", q)
        df["%"] = df["%"].astype(str) + "%"

        df2 = (
            df.pivot(columns=[], values=["#", "%"], index=["follow_up_result"])
            # .stack(level=0)
            # .T
            [0:25]
        )
        grid_rows = [
            {
                "widgets": [
                    {
                        "id": 1,
                        "name": "Follow ups by user",
                        "dataset": "followups",
                        "type": "pivot",
                        "build": {
                            "rows": [
                                {"field": "resulted_by", "alias": "User"},
                                {"field": "follow_up_result", "alias": "Result"},
                            ],
                            "values": [
                                {"fn": "COUNT", "field": "application_id", "distinct": True, "alias": "#"},
                                {"fn": "PERCENT", "field": "application_id", "distinct": True, "alias": "%"},
                            ],
                            "columns": [
                                {"field": "follow_up_number", "alias": "Follow up number"},
                            ],
                        },
                        "meta": {"html": df2.to_html(escape=False, na_rep="-", index_names=True)},
                    }
                ]
            },
        ]
        Dashboard.objects.update(title="Talent Acquisition Follow ups", grid_rows=grid_rows)

    def build_sql(self):
        rows = self.build_info["rows"]
        values = self.build_info["values"]
        columns = self.build_info["columns"]
        table_name = self.dataset["name"]

        columns = [column(field["name"]) for field in self.dataset["fields"]]
        tabl = table(table_name, *columns)
        select_fields = list()
        for value in values:
            if value["function"] == "COUNT DISTINCT":
                col = getattr(tabl.c, value["field"])
                field = func.count(func.distinct(col)).label(value["alias"])
                select_fields.append(field)

        group_by = [getattr(tabl.c, row["field"]) for row in rows]
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
