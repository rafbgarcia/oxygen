import pandas as pd
import pantab
from tableauhyperapi import (
  HyperProcess,
  Telemetry,
)
from o2.models import Dashboard


class Pivot:
  def as_json():
    q = """
    WITH totals AS (
        SELECT follow_up_number, resulted_by, COUNT(DISTINCT application_id) AS total
        FROM followups
        GROUP BY follow_up_number, resulted_by
    )

    SELECT
        f.resulted_by,
        f.follow_up_result,
        f.follow_up_number,
        COUNT(DISTINCT application_id) AS "#",
        ROUND(
            COUNT(DISTINCT application_id) / CAST(MAX(t.total) AS FLOAT),
            2
        ) AS "%"
    FROM followups f
    INNER JOIN totals t ON t.follow_up_number = f.follow_up_number AND t.resulted_by = f.resulted_by
    WHERE f.follow_up_number IN(1, 2) AND f.follow_up_date >= '2022-01-01'
    GROUP BY f.resulted_by, follow_up_result, f.follow_up_number
    ORDER BY f.resulted_by, follow_up_result, f.follow_up_number
    """

    df = pantab.frame_from_hyper_query("/Users/rafa/Downloads/test_follow_ups.hyper", q)
    df2 = (df
        .pivot(columns=["resulted_by", "follow_up_result"], values=["#", "%"], index=["follow_up_number"])
        .stack(level=0)
        .T
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
                            {"fn": "CONTRIBUTION", "field": "application_id", "distinct": True, "alias": "%"},
                        ],
                        "columns": [
                            {"field": "follow_up_number", "alias": "Follow up number"},
                        ],
                    },
                    "meta": {
                        "html": df2.to_html(escape=False, na_rep="", index_names=True)
                    }
                }
            ]
        },
    ]
    Dashboard.objects.update(title="Talent Acquisition Follow ups", grid_rows=grid_rows)
