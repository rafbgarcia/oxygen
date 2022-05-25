from django.db import models
from model_utils.models import TimeStampedModel


class Dataset(TimeStampedModel):
    name = models.CharField(max_length=100)
    query = models.TextField()


class Dashboard(TimeStampedModel):
    title = models.CharField(max_length=100)
    previous_version = models.ForeignKey('self', on_delete=models.SET_NULL, null=True)
    grid_rows = models.JSONField()


# class GridRow(TimeStampedModel):
#     dashboard = models.ForeignKey(Dashboard, on_delete=models.CASCADE)
#     dataset = models.ForeignKey(Dataset, on_delete=models.SET_NULL, null=True)
#     meta = models.JSONField('metadata')
#     type = models.CharField(max_length=20, choices=Types.choices, default=Types.PIVOT)


# class Widget(TimeStampedModel):
#     class Types(models.TextChoices):
#         PIVOT = 'pivot'
#         LINE_CHART = 'line_chart'
#         VERTICAL_BAR_CHART = 'vertical_bar_chart'

#     dashboard = models.ForeignKey(Dashboard, on_delete=models.CASCADE)
#     dataset = models.ForeignKey(Dataset, on_delete=models.SET_NULL, null=True)
#     meta = models.JSONField('metadata')
#     type = models.CharField(max_length=20, choices=Types.choices, default=Types.PIVOT)
