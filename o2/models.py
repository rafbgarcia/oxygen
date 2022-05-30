from django.db import models
from model_utils.models import TimeStampedModel
from o2.dataset import DatasetHelper
from o2.widgets.pivot import Pivot
from o2.widgets.vertical_bar_chart import VerticalBarChart
from powerBi.settings import BASE_DIR
import pandas as pd
import pantab
from os.path import exists

TABLE_MODE_APPEND = "a"


class Dataset(TimeStampedModel):
    name = models.CharField(max_length=100, unique=True)
    query = models.TextField()
    is_building = models.BooleanField(default=False)
    size_mb = models.DecimalField(max_digits=10, decimal_places=1)
    last_built_at = models.DateTimeField()
    build_duration_seconds = models.SmallIntegerField()
    fields = models.JSONField()
    total_records = models.IntegerField()

    def file_path(self):
        return BASE_DIR / f"{self.name}.hyper"

    def exists(self):
        return exists(self.file_path())

    def append(self, rows):
        dtypes = DatasetHelper.fields_to_pandas_dtype(self.fields)
        field_names = [field["name"] for field in self.fields]

        df = pd.DataFrame(rows, columns=field_names)
        df = df.astype(dtypes, errors="ignore")
        pantab.frame_to_hyper(df, self.file_path(), table=self.name, table_mode=TABLE_MODE_APPEND)

    def dtypes(self):
        return {field["name"]: DatasetHelper.convert_to_pandas_dtype(field["type"]) for field in self.fields}

    def execute(self, sql):
        return pantab.frame_from_hyper_query(self.file_path(), sql)


class Dashboard(TimeStampedModel):
    name = models.CharField(max_length=100)
    previous_version = models.ForeignKey("self", on_delete=models.SET_NULL, null=True)
    dataset = models.ForeignKey(Dataset, on_delete=models.SET_NULL, null=True)
    grid_rows = models.JSONField()


class Widget(TimeStampedModel):
    class Types(models.TextChoices):
        PIVOT_TABLE = "pivot_table"
        LINE_CHART = "line_chart"
        VERTICAL_BAR_CHART = "vertical_bar_chart"

    dashboard = models.ForeignKey(Dashboard, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=200, null=True)
    type = models.CharField(max_length=20, choices=Types.choices)
    build_info = models.JSONField()
    grid_row_index = models.SmallIntegerField()

    WIDGET = {"pivot_table": Pivot, "vertical_bar_chart": VerticalBarChart}

    def builder(self):
        return self.WIDGET[self.type]

    def metadata(self, dataset):
        return self.builder().metadata(dataset, self.build_info)
