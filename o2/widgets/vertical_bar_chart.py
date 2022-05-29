import itertools
from random import random
import string
from sqlalchemy import table, column, select, func
from sqlalchemy.dialects import postgresql
from o2.dataset import dataset_execute
from o2.widgets.pivot import Pivot


class VerticalBarChart(Pivot):
    def metadata(self):
        pivot = self.build()
        values = pivot.values.tolist()
        labels = pivot.columns.tolist()
        xaxis = pivot.index.tolist()

        return {
            "chartData": [
                {"name": labels[i], "data": [v[i] for v in values]} for (i, _) in enumerate(labels)
            ],
            "legend": True,
            "xAxisCategories": xaxis,
            "id": "dashboard-123",
        }

    def build(self):
        query = self.build_sql()
        rows = [field["alias"] for field in self.build_info["rows"]]
        values = [field["alias"] for field in self.build_info["values"]]
        columns = [field["alias"] for field in self.build_info["columns"]]
        df = dataset_execute(self.dataset["name"], query)
        pivot = df.pivot(columns=columns, values=values, index=rows).fillna("-")

        return pivot
