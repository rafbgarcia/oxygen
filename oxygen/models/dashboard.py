from django.db import models
from model_utils.models import TimeStampedModel
from oxygen.models.dataset import Dataset


class Dashboard(TimeStampedModel):
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name="dashboards")
    name = models.CharField(max_length=100)
    layout = models.JSONField(null=False, default=list)
