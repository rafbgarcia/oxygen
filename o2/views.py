from django.forms import model_to_dict
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import pandas as pd
import pantab
import time
import mysql.connector
import humps
from o2.widgets.pivot import Pivot

from o2.models import Dashboard

def create_dataset(request):
    mysqlconn = mysql.connector.connect(host="127.0.0.1", port=3306, user="root", password="talkbox", database="pws_dev")
    mysqlcur = mysqlconn.cursor()
    mysqlcur.execute("""
    SELECT application_id, follow_up_number, follow_up_date, follow_up_date_string, follow_up_result, resulted_by, title_name
    FROM untitled_name
    """)

    df = pd.DataFrame(
        mysqlcur.fetchall(),
        columns=["application_id", "follow_up_number", "follow_up_date", "follow_up_date_string", "follow_up_result", "resulted_by", "title_name"],
    )
    df['follow_up_date'] = df['follow_up_date'].astype('datetime64[ns]')

    s = time.time()
    pantab.frame_to_hyper(df, "/Users/rafa/Downloads/test_follow_ups.hyper", table="followups")
    e = round(time.time() - s, 2)

    mysqlconn.close()

    return HttpResponse(f"Success {e}")


def dashboard(request, id):
    Pivot.as_json()
    dashboard = Dashboard.objects.get(pk=id)
    return JsonResponse(humps.camelize(model_to_dict(dashboard)))
