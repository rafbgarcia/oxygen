import os
from time import time
from django.db import models
from django.utils import timezone
from model_utils.models import TimeStampedModel
from o2.connectors import MySQLConnector
from o2.dataset_helpers import DatasetHelper
from o2.widgets.pivot import Pivot
from o2.widgets.vertical_bar_chart import VerticalBarChart
from powerBi.settings import BASE_DIR
import pandas as pd
import pantab
from os.path import exists

TABLE_MODE_APPEND = "a"


class Dataset(TimeStampedModel):
    name = models.CharField(max_length=100, unique=True)
    is_building = models.BooleanField(default=False, null=True)
    size_mb = models.DecimalField(max_digits=10, decimal_places=1, null=True)
    last_built_at = models.DateTimeField(null=True)
    build_duration_seconds = models.SmallIntegerField(null=True)

    @classmethod
    def build(self, id):
        dataset = Dataset.objects.prefetch_related("tables").get(pk=id)

        start_time = time()
        for table in dataset.tables.all():
            table.total_records = 0

            with MySQLConnector().execute(table.query) as cursor:
                while True:
                    rows = cursor.fetchmany(100_000)
                    if len(rows) == 0:
                        break

                    table.total_records += len(rows)
                    dataset.append(table, rows)

            table.save()

        dataset.build_duration_seconds = time() - start_time
        dataset.size_mb = os.path.getsize(dataset.file_path()) / 1e6
        dataset.last_built_at = timezone.now()
        dataset.save()

        return dataset

    def file_path(self):
        return BASE_DIR / "datasources" / f"{self.name}.hyper"

    def file_exists(self):
        return exists(self.file_path())

    def append(self, table, rows):
        df = pd.DataFrame(rows, columns=table.field_names())
        df = df.astype(table.dtypes(), errors="ignore")
        pantab.frame_to_hyper(df, self.file_path(), table=table.name, table_mode=TABLE_MODE_APPEND)

    def execute(self, sql):
        return pantab.frame_from_hyper_query(self.file_path(), sql)


class DatasetTable(models.Model):
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name="tables")
    name = models.CharField(max_length=50)
    query = models.TextField()
    fields = models.JSONField(null=True)
    total_records = models.IntegerField(null=True)
    html_preview = models.TextField(null=True)

    models.UniqueConstraint(fields=[dataset, name], name="unique_dataset_table_name")

    def dtypes(self):
        return DatasetHelper.fields_to_pandas_dtype(self.fields)

    def field_names(self):
        return [field["name"] for field in self.fields]


class Dashboard(TimeStampedModel):
    name = models.CharField(max_length=100)
    previous_version = models.ForeignKey("self", on_delete=models.SET_NULL, null=True)
    dataset = models.ForeignKey(Dataset, on_delete=models.SET_NULL, null=True)
    grid_rows = models.JSONField(null=True)


class Widget(TimeStampedModel):
    class Types(models.TextChoices):
        PIVOT_TABLE = "pivot_table"
        LINE_CHART = "line_chart"
        VERTICAL_BAR_CHART = "vertical_bar_chart"

    dashboard = models.ForeignKey(Dashboard, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=200, null=True)
    type = models.CharField(max_length=20, choices=Types.choices)
    build_info = models.JSONField()
    grid_row_index = models.SmallIntegerField()

    WIDGET = {"pivot_table": Pivot, "vertical_bar_chart": VerticalBarChart}

    def builder(self):
        return self.WIDGET[self.type]

    def metadata(self, dataset):
        return self.builder().metadata(dataset, self.build_info)
