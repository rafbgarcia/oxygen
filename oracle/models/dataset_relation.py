from django.db import models
from oracle.models.dataset import Dataset


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
