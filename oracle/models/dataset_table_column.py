from django.db import models
from oracle.models.dataset_table import DatasetTable


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
