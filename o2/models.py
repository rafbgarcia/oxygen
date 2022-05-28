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
    fields = models.JSONField(default=None)
    count = models.IntegerField(default=None)


class Dashboard(TimeStampedModel):
    name = models.CharField(max_length=100)
    previous_version = models.ForeignKey("self", on_delete=models.SET_NULL, null=True)


class DashboardRow(TimeStampedModel):
    dashboard = models.ForeignKey(Dashboard, on_delete=models.CASCADE)
    index = models.SmallIntegerField(default=None)


class Widget(TimeStampedModel):
    class Types(models.TextChoices):
        PIVOT_TABLE = "pivot_table"
        LINE_CHART = "line_chart"
        VERTICAL_BAR_CHART = "vertical_bar_chart"

    dataset = models.ForeignKey(Dataset, on_delete=models.SET_NULL, default=None, null=True)
    dashboard_row = models.ForeignKey(DashboardRow, on_delete=models.SET_NULL, default=None, null=True)
    title = models.CharField(max_length=200, null=True)
    type = models.CharField(max_length=20, choices=Types.choices, default=Types.PIVOT_TABLE)
    build_info = models.JSONField()
