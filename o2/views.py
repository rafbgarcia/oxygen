from datetime import datetime
import json
import os
from django.forms import model_to_dict
from django.http import JsonResponse
import pandas as pd
import pantab
import mysql.connector
import humps
from o2.widgets.pivot import Pivot
from o2.models import Dashboard, Dataset
from django.views.decorators.csrf import csrf_exempt
from powerBi.settings import BASE_DIR
from contextlib import contextmanager

DATASETS_FOLDER = BASE_DIR
connection_config = {
    "host": "127.0.0.1",
    "port": 3306,
    "user": "root",
    "password": "talkbox",
    "database": "pws_dev",
}


class MySQL(object):
    def __init__(self, config):
        self.config = config

    @contextmanager
    def execute(self, query):
        conn = mysql.connector.connect(**self.config)
        cursor = conn.cursor()
        cursor.execute(query)
        yield cursor
        conn.close()


def multably_map_dtypes_user_types(dtypes_dict):
    for key in dtypes_dict:
        pandas_dtype = dtypes_dict[key].lower()
        if "object" in pandas_dtype:
            dtypes_dict[key] = "Text"
        elif "int" in pandas_dtype:
            dtypes_dict[key] = "Number"
        elif "float" in pandas_dtype:
            dtypes_dict[key] = "Number"
        elif "datetime" in pandas_dtype:
            dtypes_dict[key] = "DateTime"
        elif "bool" in pandas_dtype:
            dtypes_dict[key] = "Boolean"


def datasets(request):
    datasets = [model_to_dict(dataset) for dataset in Dataset.objects.all()]
    return JsonResponse(humps.camelize({"datasets": datasets}))


@csrf_exempt
def preview_dataset(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid HTTP method"})

    params = json.loads(request.body)
    with MySQL(connection_config).execute(params["query"]) as cursor:
        fields = cursor.column_names
        df = pd.DataFrame(cursor.fetchmany(25), columns=fields)

    dtypes = df.dtypes.to_frame("dtypes").reset_index().set_index("index")["dtypes"].astype(str).to_dict()
    multably_map_dtypes_user_types(dtypes)

    return JsonResponse(
        {
            "fields": dtypes,
            "html": df.to_html(index=False, na_rep="", escape=False),
        }
    )


@csrf_exempt
def create_dataset(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid HTTP method"})

    params = json.loads(request.body)

    # TODO: fetch all lines
    with MySQL(connection_config).execute(params["query"]) as cursor:
        fields = cursor.column_names
        df = pd.DataFrame(cursor.fetchmany(100_000), columns=fields)

    filepath = DATASETS_FOLDER / f"{params['name']}.hyper"
    pantab.frame_to_hyper(df, filepath, table=params["name"])

    params["size_mb"] = os.path.getsize(filepath) / 1e6
    params["last_built_at"] = datetime.now()
    dataset = Dataset.objects.create(**params)

    return JsonResponse(humps.camelize(model_to_dict(dataset)))


def dashboard(request, id):
    dashboard = Dashboard.objects.get(pk=id)
    return JsonResponse(humps.camelize(model_to_dict(dashboard)))


def widget(request, id):
    Pivot.as_json()
    dash = Dashboard.objects.first()
    widget = dash.grid_rows[0]["widgets"][0]
    widget["dataset"] = {
        "fields": [
            {"name": "application_id", "type": "number"},
            {"name": "follow_up_number", "type": "number"},
            {"name": "follow_up_date", "type": "datetime"},
            {"name": "follow_up_date_string", "type": "string"},
            {"name": "follow_up_result", "type": "string"},
            {"name": "resulted_by", "type": "string"},
            {"name": "title_name", "type": "string"},
        ]
    }
    return JsonResponse(humps.camelize(widget))
