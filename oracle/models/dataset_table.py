from django.db import models
from oracle.models.dataset import Dataset


class DatasetTable(models.Model):
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name="tables")
    name = models.CharField(max_length=50)
    title = models.CharField(max_length=50)
    query = models.TextField()
    total_records = models.IntegerField(null=True)
    html_preview = models.TextField(null=True)
    connector = models.CharField(max_length=30, default="mysql")
    x = models.SmallIntegerField(default=0)
    y = models.SmallIntegerField(default=0)

    models.UniqueConstraint(fields=[dataset, name], name="unique_dataset_table_name")
