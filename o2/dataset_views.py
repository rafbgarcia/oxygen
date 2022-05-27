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
        cols = map_dtypes_user_types(dataset["fields"])
        dataset["fields"] = [{"name": name, "type": dtype} for (name, dtype) in cols.items()]

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

    dataset_params = {"query": params["query"], "name": params["name"]}
    dataset_params["count"] = 0

    start_time = time()
    with MySQL(connection_config).execute(params["query"]) as cursor:
        while True:
            rows = cursor.fetchmany(ROWS_COUNT)
            if len(rows) == 0:
                break

            dataset_params["count"] += len(rows)
            df = pd.DataFrame(rows, columns=cursor.column_names)
            df = df.astype(dtypes)
            pantab.frame_to_hyper(df, filepath, table=dataset_params["name"], table_mode=TABLE_MODE_APPEND)

    dataset_params["build_duration_seconds"] = time() - start_time
    dataset_params["size_mb"] = os.path.getsize(filepath) / 1e6
    dataset_params["last_built_at"] = timezone.now()
    dataset_params["fields"] = dtypes
    dataset = Dataset.objects.create(**dataset_params)

    return JsonResponse(humps.camelize(model_to_dict(dataset)))
