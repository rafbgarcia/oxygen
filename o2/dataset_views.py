import json
import os
from time import time
from django.forms import model_to_dict
from django.http import JsonResponse
import pandas as pd
import mysql.connector
import humps
from django.utils import timezone
from o2.dataset_helpers import DatasetHelper
from o2.models import Dataset, DatasetTable
from django.views.decorators.csrf import csrf_exempt
from powerBi.settings import BASE_DIR
from contextlib import contextmanager

DATASETS_FOLDER = BASE_DIR
ROWS_COUNT = 100_000
TABLE_MODE_APPEND = "a"
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


def index(request):
    datasets = [model_to_dict(dataset) for dataset in Dataset.objects.all()]
    return JsonResponse(humps.camelize({"datasets": datasets}))


@csrf_exempt
def preview(request):
    params = json.loads(request.body)

    with MySQL(connection_config).execute(params["query"]) as cursor:
        fields = cursor.column_names
        df = pd.DataFrame(cursor.fetchmany(25), columns=fields)

    dtypes = df.dtypes.to_frame("dtypes").reset_index().set_index("index")["dtypes"].astype(str).to_dict()
    data = {
        "fields": DatasetHelper.pandas_dtypes_to_fields(dtypes),
        "html_preview": df.to_html(index=False, na_rep="", escape=False),
    }

    return JsonResponse(humps.camelize(data))


@csrf_exempt
def create(request):
    params = humps.decamelize(json.loads(request.body))
    dataset = Dataset.objects.create(name=params["name"])
    return JsonResponse(humps.camelize(model_to_dict(dataset)))
