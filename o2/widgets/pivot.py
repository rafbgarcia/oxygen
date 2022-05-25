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

    df = pantab.frame_from_hyper_query("/Users/rafa/Downloads/test_follow_ups.hyper", q)
    df['%'] = df['%'].astype(str) + '%'

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
                            {"fn": "PERCENT", "field": "application_id", "distinct": True, "alias": "%"},
                        ],
                        "columns": [
                            {"field": "follow_up_number", "alias": "Follow up number"},
                        ],
                    },
                    "meta": {
                        "html": df2.to_html(escape=False, na_rep="-", index_names=True)
                    }
                }
            ]
        },
    ]
    Dashboard.objects.update(title="Talent Acquisition Follow ups", grid_rows=grid_rows)
