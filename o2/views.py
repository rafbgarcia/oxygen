from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import pandas as pd
import pantab
from tableauhyperapi import (
  HyperProcess,
  Telemetry,
)
import time
import mysql.connector

def create(request):
    mysqlconn = mysql.connector.connect(host="127.0.0.1", port=3306, user="root", password="talkbox", database="pws_dev")
    mysqlcur = mysqlconn.cursor()
    mysqlcur.execute("""
    SELECT application_id, follow_up_number, follow_up_date, follow_up_date_string, follow_up_result, resulted_by, title_name
    FROM untitled_name
    LIMIT 10000
    """)

    df = pd.DataFrame(
        mysqlcur.fetchall(),
        columns=["application_id", "follow_up_number", "follow_up_date", "follow_up_date_string", "follow_up_result", "resulted_by", "title_name"],
    )

    s = time.time()
    pantab.frame_to_hyper(df, "/Users/rafa/Downloads/test_follow_ups.hyper", table="followups")
    e = round(time.time() - s, 2)

    mysqlconn.close()

    return HttpResponse(f"Success {e}")


def fetch(request):
    # q = "SELECT resulted_by_id, follow_up_result, COUNT(distinct application_id) FROM followups GROUP BY follow_up_result"
    # df = pantab.frame_from_hyper_query("/Users/rafa/Downloads/test_follow_ups.hyper", q)

    table_widget = {
        "rows": [
            {"column": "resulted_by", "alias": "User"},
            {"column": "follow_up_result", "alias": "Result"},
        ],
        "values": [
            {"fn": "COUNT", "column": "DISTINCT(application_id)", "alias": "#"},
            {"fn": "CONTRIBUTION", "column": "DISTINCT(application_id)", "alias": "%"},
        ],
        "columns": [
            {"column": "follow_up_number", "alias": "Follow up number"},
        ],
    }

    q = """
    select
        f.resulted_by,
        f.follow_up_result,
        f.follow_up_number,
        count(distinct application_id) as "#",
        ROUND(
            COUNT(distinct application_id) / (
                SELECT CAST(count(distinct application_id) as float)
                FROM followups
                WHERE follow_up_number = f.follow_up_number AND resulted_by = f.resulted_by
            ),
            2
        ) as total
    from followups f
    where f.follow_up_number IN(1, 2) AND f.follow_up_date >= '2022-01-01'
    group by f.resulted_by, follow_up_result, f.follow_up_number
    order by f.resulted_by, follow_up_result, f.follow_up_number
    """

    df = pantab.frame_from_hyper_query("/Users/rafa/Downloads/test_follow_ups.hyper", q)
    df2 = (df
        .pivot(columns=["resulted_by", "follow_up_result"], values=["#", "total"], index=["follow_up_number"])
        .stack(level=0)
        .T
        .iloc[4:13]
    )

    print(df2.to_html(escape=False, na_rep="", index_names=False))
    return HttpResponse(df2.to_html(escape=False, na_rep="", index_names=False))
