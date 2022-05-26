from email.policy import default
from django.db import models
from model_utils.models import TimeStampedModel


class Dataset(TimeStampedModel):
    name = models.CharField(max_length=100, unique=True)
    query = models.TextField()
    is_building = models.BooleanField(default=False)
    size_mb = models.DecimalField(default=None, max_digits=10, decimal_places=1)
    last_built_at = models.DateTimeField(default=None)
    build_duration_seconds = models.SmallIntegerField(default=None)
    dtypes = models.JSONField(default=None)
    count = models.IntegerField(default=None)


class Dashboard(TimeStampedModel):
    name = models.CharField(max_length=100)
    previous_version = models.ForeignKey("self", on_delete=models.SET_NULL, null=True)


class Widget(TimeStampedModel):
    dataset = models.ForeignKey(Dataset, on_delete=models.SET_NULL, default=None, null=True)
    type = models.CharField(max_length=20)
    build_info = models.JSONField()
    meta = models.JSONField()


class DashboardRows(TimeStampedModel):
    dashboard = models.ForeignKey(Dashboard, on_delete=models.CASCADE)
    widget = models.ForeignKey(Widget, on_delete=models.CASCADE)


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
