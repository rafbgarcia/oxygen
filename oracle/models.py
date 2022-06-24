import os
from time import time
from django.db import models
from django.utils import timezone
from model_utils.models import TimeStampedModel
from oracle.connectors import MySQLConnector
from oracle.dataset_helpers import DatasetHelper
from powerBi.settings import BASE_DIR
import pandas as pd
from os.path import exists
import pantab_server.pantab_client as pantab


class Dataset(TimeStampedModel):
    name = models.CharField(max_length=100, unique=True)
    file_name = models.CharField(max_length=100, unique=True)
    is_building = models.BooleanField(default=False, null=True)
    size_mb = models.DecimalField(max_digits=10, decimal_places=1, null=True)
    last_built_at = models.DateTimeField(null=True)
    build_duration_seconds = models.SmallIntegerField(null=True)

    @staticmethod
    def build(id):
        dataset = Dataset.objects.prefetch_related("tables").get(pk=id)
        if dataset.file_exists():
            os.remove(dataset.file_path())

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
        return BASE_DIR / "datasets" / f"{self.file_name}.hyper"

    def file_exists(self):
        return exists(self.file_path())

    def append(self, table, rows):
        df = pd.DataFrame(rows, columns=table.column_names())
        df = df.astype(table.dtypes(), errors="ignore")
        pantab.append(df, self.file_name, table.name)

    def execute(self, sql):
        return pantab.query(self.file_name, sql)


class DatasetTable(models.Model):
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name="tables")
    name = models.CharField(max_length=50)
    title = models.CharField(max_length=50)
    query = models.TextField()
    total_records = models.IntegerField(null=True)
    html_preview = models.TextField(null=True)

    models.UniqueConstraint(fields=[dataset, name], name="unique_dataset_table_name")

    def dtypes(self):
        return DatasetHelper.fields_to_pandas_dtype(self.columns.all())

    def column_names(self):
        return [column.name for column in self.columns.all()]


class DatasetTableColumn(models.Model):
    class JoinTypes(models.TextChoices):
        INNER_JOIN = "INNER JOIN"
        LEFT_JOIN = "LEFT JOIN"

    class ColumnTypes(models.TextChoices):
        TEXT = "Text"
        INTEGER = "Integer"
        FLOAT = "Float"
        DATETIME = "DateTime"

    name = models.CharField(max_length=50)
    type = models.CharField(max_length=20, choices=ColumnTypes.choices)
    table = models.ForeignKey(DatasetTable, on_delete=models.CASCADE, related_name="columns")

    models.UniqueConstraint(fields=[table, name], name="unique_table_column_name")


class DatasetRelation(models.Model):
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name="relations")
    source_table = models.CharField(max_length=50)
    source_column = models.CharField(max_length=50)
    reference_table = models.CharField(max_length=50)
    reference_column = models.CharField(max_length=50)

    models.UniqueConstraint(
        fields=[dataset, source_table, source_column, reference_table, reference_column],
        name="unique_dataset_relationship",
    )


class Dashboard(TimeStampedModel):
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name="dashboards")
    name = models.CharField(max_length=100)
    layout = models.JSONField(null=False, default=list)


class Widget(TimeStampedModel):
    class Types(models.TextChoices):
        TEXT = "Text"
        PIVOT_TABLE = "Pivot Table"
        VERTICAL_BAR_CHART = "Vertical Bar Chart"

    dashboard = models.ForeignKey(Dashboard, on_delete=models.CASCADE, related_name="widgets")
    type = models.CharField(max_length=20, choices=Types.choices)
    build_info = models.JSONField(default=dict)
