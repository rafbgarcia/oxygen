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
        categories = pivot.columns.tolist()
        stacks = pivot.index.tolist()

        return {
            "chartData": [{"name": categories[0], "data": values}],
            "legend": True,
            "xAxisCategories": list(itertools.chain(*stacks)),
            "id": "dashboard-123",
        }
