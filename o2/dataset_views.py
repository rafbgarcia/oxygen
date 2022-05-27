import json
import os
from time import time
from django.forms import model_to_dict
from django.http import JsonResponse
import pandas as pd
import pantab
import mysql.connector
import humps
from django.utils import timezone
from o2.dataset import map_dtypes_user_types, map_user_types_to_dtypes
from o2.models import Dataset
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
    for dataset in datasets:
        dataset["dtypes"] = map_dtypes_user_types(dataset["dtypes"])

    return JsonResponse(humps.camelize({"datasets": datasets}))


@csrf_exempt
def preview(request):
    params = json.loads(request.body)
    with MySQL(connection_config).execute(params["query"]) as cursor:
        fields = cursor.column_names
        df = pd.DataFrame(cursor.fetchmany(25), columns=fields)
    dtypes = df.dtypes.to_frame("dtypes").reset_index().set_index("index")["dtypes"].astype(str).to_dict()
    dtypes = map_dtypes_user_types(dtypes)

    return JsonResponse(
        {
            "fields": dtypes,
            "html": df.to_html(index=False, na_rep="", escape=False),
        }
    )


@csrf_exempt
def create(request):
    params = json.loads(request.body)
    filepath = DATASETS_FOLDER / f"{params['name']}.hyper"
    dtypes = map_user_types_to_dtypes(params["dtypes"])
    params["count"] = 0

    start_time = time()
    with MySQL(connection_config).execute(params["query"]) as cursor:
        while True:
            rows = cursor.fetchmany(ROWS_COUNT)
            if len(rows) == 0:
                break

            params["count"] += len(rows)
            df = pd.DataFrame(rows, columns=cursor.column_names)
            df = df.astype(dtypes)
            pantab.frame_to_hyper(df, filepath, table=params["name"], table_mode=TABLE_MODE_APPEND)

    params["build_duration_seconds"] = time() - start_time
    params["size_mb"] = os.path.getsize(filepath) / 1e6
    params["last_built_at"] = timezone.now()
    params["dtypes"] = dtypes
    dataset = Dataset.objects.create(**params)

    return JsonResponse(humps.camelize(model_to_dict(dataset)))
