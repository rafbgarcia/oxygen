from operator import attrgetter, itemgetter
import uuid
from o2.models import Dataset, DatasetRelation, DatasetTableColumn, Widget
from o2.widgets.pivot import Pivot
from o2.widgets.text import Text
from o2.widgets.sql_builder import SQLBuilder
from o2.widgets.vertical_bar_chart import VerticalBarChart


class WidgetBuilder:
    @staticmethod
    def build(widget):
        fn = {
            Widget.Types.PIVOT_TABLE: WidgetBuilder.pivot,
            Widget.Types.VERTICAL_BAR_CHART: WidgetBuilder.vertical_bar_chart,
            Widget.Types.TEXT: WidgetBuilder.text,
        }

        return fn[widget.type](widget)

    @staticmethod
    def pivot(widget):
        offset, limit = 0, 25
        pivot = WidgetBuilder._pivot(widget)
        if pivot is None:
            return

        columns = widget.build_info["columns"]
        if len(columns) > 0:
            # Swap the first column with the values table row
            pivot = pivot.swaplevel(0, len(columns), axis="columns").sort_index(axis="columns")

        return {"html": pivot[offset:limit].to_html(escape=False, na_rep="-", index_names=True)}

    @staticmethod
    def _pivot(widget):
        rows_aliases, columns_aliases, values_aliases = _aliases(widget.build_info)
        if len(rows_aliases + columns_aliases) == 0:
            return None

        df = _dataframe(widget)
        return df.pivot(columns=columns_aliases, values=values_aliases, index=rows_aliases)

    @staticmethod
    def vertical_bar_chart(widget):
        pivot = WidgetBuilder._pivot(widget)
        if pivot is None:
            return

        values = pivot.values.tolist()
        labels = pivot.columns.tolist()
        xaxis = pivot.index.tolist()
        # id = uuid.uuid4()

        return {
            "datasets": [
                {"label": labels[i], "data": [v[i] for v in values], "backgroundColor": "rgb(0,86,207)"}
                for (i, _) in enumerate(labels)
            ],
            "labels": xaxis,
            # "id": f"dashboard-{id}",
        }

    @staticmethod
    def text(widget):
        return widget.build_info


def _aliases(build_info):
    rows = list(map(itemgetter("alias"), build_info["rows"]))
    columns = list(map(itemgetter("alias"), build_info["columns"]))
    values = list(map(itemgetter("alias"), build_info["values"]))
    return rows, columns, values


def _dataframe(widget):
    dataset = Dataset.objects.prefetch_related("tables").get(pk=widget.dashboard.dataset_id)
    tables = list(dataset.tables.all())
    table_names = [table.name for table in dataset.tables.all()]
    relations = DatasetRelation.objects.filter(source_table__in=table_names).all()
    rows, columns, values = itemgetter("rows", "columns", "values")(widget.build_info)
    dimensions = [SQLBuilder.Column(**dimension) for dimension in (rows + columns)]
    measures = [SQLBuilder.Column(**measure) for measure in values]

    query = SQLBuilder.build(
        dimensions=dimensions,
        measures=measures,
        tables=tables,
        relations=relations,
    )
    return dataset.execute(query)
