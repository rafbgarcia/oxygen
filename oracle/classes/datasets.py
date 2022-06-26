import os
from time import time
from django.utils import timezone
from oracle.classes.dataset_tables import DatasetTables
from oracle.models.dataset import Dataset
from powerBi.settings import BASE_DIR


class Datasets:
    @staticmethod
    def build(dataset_id):
        dataset = _find(dataset_id)

        start_time = time()
        for table in dataset.tables.all():
            DatasetTables.build(dataset.file_name, table, limit=100_000)

        dataset.build_duration_seconds = time() - start_time
        dataset.size_mb = os.path.getsize(_file_path(dataset)) / 1e6
        dataset.last_built_at = timezone.now()
        dataset.save()

        return dataset


def _find(dataset_id):
    return Dataset.objects.prefetch_related("tables").get(pk=dataset_id)


def _file_path(dataset):
    return BASE_DIR / "datasets" / f"{dataset.file_name}.hyper"
