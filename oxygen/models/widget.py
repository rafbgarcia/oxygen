from django.db import models
from model_utils.models import TimeStampedModel
from oxygen.models.dashboard import Dashboard


class Widget(TimeStampedModel):
    class Types(models.TextChoices):
        TEXT = "Text"
        PIVOT_TABLE = "Pivot Table"
        VERTICAL_BAR_CHART = "Vertical Bar Chart"

    dashboard = models.ForeignKey(Dashboard, on_delete=models.CASCADE, related_name="widgets")
    type = models.CharField(max_length=20, choices=Types.choices)
    build_info = models.JSONField(default=dict)
