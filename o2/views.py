from django.forms import model_to_dict
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from matplotlib.widgets import Widget
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
    dashboard = Dashboard.objects.get(pk=id)
    return JsonResponse(humps.camelize(model_to_dict(dashboard)))


def widget(request, id):
    Pivot.as_json()
    dash = Dashboard.objects.first()
    widget = dash.grid_rows[0]['widgets'][0]
    widget['dataset'] = {
        'fields': [
            { 'name': "application_id", 'type': 'number'},
            { 'name': "follow_up_number", 'type': 'number'},
            { 'name': "follow_up_date", 'type': 'datetime'},
            { 'name': "follow_up_date_string", 'type': 'string'},
            { 'name': "follow_up_result", 'type': 'string'},
            { 'name': "resulted_by", 'type': 'string'},
            { 'name': "title_name", 'type': 'string'},
        ]
    }
    return JsonResponse(humps.camelize(widget))
