from django.db import models


class Dataset(models.Model):
    last_updated_at = models.DateTimeField('last updated at')
    query = models.TextField()
    update_every = models.CharField(max_length=20)


class Widget(models.Model):
    dataset = models.ForeignKey(Dataset, on_delete=models.SET_NULL)
