from django.db import models
from model_utils.models import TimeStampedModel


class Dataset(TimeStampedModel):
    name = models.CharField(max_length=100, unique=True)
    file_name = models.CharField(max_length=100, unique=True)
    is_building = models.BooleanField(default=False, null=True)
    size_mb = models.DecimalField(max_digits=10, decimal_places=1, null=True)
    last_built_at = models.DateTimeField(null=True)
    build_duration_seconds = models.SmallIntegerField(null=True)
