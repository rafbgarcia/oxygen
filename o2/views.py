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
    q = """
    with totals as (
        select resulted_by, follow_up_number, count(distinct application_id) t
        from followups
        group by resulted_by, follow_up_number
    )

    select
        f.resulted_by,
        f.follow_up_result,
        f.follow_up_number,
        count(distinct application_id) as "#",
        MAX(totals.t) as "%"
    from followups f
    inner join totals on totals.resulted_by = f.resulted_by AND totals.follow_up_number = f.follow_up_number
    where f.follow_up_number < 4
    group by f.resulted_by, follow_up_result, f.follow_up_number
    order by f.resulted_by, follow_up_result, f.follow_up_number
    """

    df = pantab.frame_from_hyper_query("/Users/rafa/Downloads/test_follow_ups.hyper", q)
    df2 = (df
    .pivot(columns="follow_up_number", values=["#", "%"], index=["resulted_by", "follow_up_result"])
    .fillna(0)
    .stack(level=0)
    )

    return HttpResponse(df2.to_json())
