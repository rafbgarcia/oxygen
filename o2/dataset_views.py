import json
import os
from time import time
from django.forms import model_to_dict
from django.http import JsonResponse
import pandas as pd
import mysql.connector
import humps
from django.utils import timezone
from o2.dataset import DatasetHelper
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
    return JsonResponse(humps.camelize({"datasets": datasets}))


@csrf_exempt
def preview(request):
    params = json.loads(request.body)

    with MySQL(connection_config).execute(params["query"]) as cursor:
        fields = cursor.column_names
        df = pd.DataFrame(cursor.fetchmany(25), columns=fields)

    dtypes = df.dtypes.to_frame("dtypes").reset_index().set_index("index")["dtypes"].astype(str).to_dict()
    fields = DatasetHelper.pandas_dtypes_to_fields(dtypes)

    return JsonResponse(
        {
            "fields": fields,
            "html": df.to_html(index=False, na_rep="", escape=False),
        }
    )


@csrf_exempt
def create(request):
    params = json.loads(request.body)
    dataset = Dataset(**params)
    dataset.totalRecords = 0

    start_time = time()
    with MySQL(connection_config).execute(dataset.query) as cursor:
        while True:
            rows = cursor.fetchmany(ROWS_COUNT)
            if len(rows) == 0:
                break

            dataset.totalRecords += len(rows)
            dataset.append(rows)

    dataset.build_duration_seconds = time() - start_time
    dataset.size_mb = os.path.getsize(dataset.file_path()) / 1e6
    dataset.last_built_at = timezone.now()
    dataset.save()

    return JsonResponse(humps.camelize(model_to_dict(dataset)))
