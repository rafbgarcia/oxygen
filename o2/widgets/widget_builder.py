from operator import itemgetter
import uuid

import pantab
from o2.models import Dataset, DatasetRelation, DatasetTableColumn, Widget
from o2.widgets.pivot import Pivot
from o2.widgets.text import Text
from o2.widgets.sql_builder import SQLBuilder
from o2.widgets.vertical_bar_chart import VerticalBarChart


class WidgetBuilder:
    @staticmethod
    def build(type, dataset, build):
        fn = {
            Widget.Types.PIVOT_TABLE: WidgetBuilder.pivot,
            Widget.Types.VERTICAL_BAR_CHART: WidgetBuilder.vertical_bar_chart,
        }

        return fn[type](dataset=dataset, build=build)

    @staticmethod
    def pivot(build, dataset, **_kwargs):
        offset, limit = 0, 25
        rows_aliases, columns_aliases, values_aliases = _aliases(build)
        if len(rows_aliases + columns_aliases) == 0:
            return None

        df = _dataframe(build, dataset)

        if build.get("row_totals"):
            df.loc["Grand Total"] = df.sum(numeric_only=True, axis=0)
            df.iloc[-1, 0] = "Grand Total"

        if build.get("column_totals"):
            df.loc[:, "Grand Total"] = df.sum(numeric_only=True, axis=1)
            values_aliases += ["Grand Total"]

        pivot = df.pivot(
            columns=columns_aliases,
            values=values_aliases,
            index=rows_aliases,
        )

        if len(columns_aliases) > 0:
            # Swap the first column with the values table row
            pivot = pivot.swaplevel(0, len(columns_aliases), axis="columns").sort_index(axis="columns")

        return {"html": pivot[offset:limit].to_html(escape=False, na_rep="-", index_names=True)}

    @staticmethod
    def vertical_bar_chart(build, dataset, **_kwargs):
        rows_aliases, columns_aliases, values_aliases = _aliases(build)
        if len(rows_aliases + columns_aliases) == 0:
            return None

        df = _dataframe(build, dataset)
        pivot = df.pivot(
            columns=columns_aliases,
            values=values_aliases,
            index=rows_aliases,
        )
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


def _aliases(build_info):
    rows = list(map(itemgetter("alias"), build_info["rows"]))
    columns = list(map(itemgetter("alias"), build_info["columns"]))
    values = list(map(itemgetter("alias"), build_info["values"]))
    return rows, columns, values


def _dataframe(build, dataset):
    rows, columns, values = itemgetter("rows", "columns", "values")(build)
    query = SQLBuilder.build(
        dimensions=[SQLBuilder.Column(**dimension) for dimension in (rows + columns)],
        measures=[SQLBuilder.Column(**measure) for measure in values],
        tables=[SQLBuilder.Table(**table) for table in dataset["tables"]],
        relations=[SQLBuilder.Relation(**relation) for relation in dataset["relations"]],
    )

    return pantab.frame_from_hyper_query(dataset["file_path"], query)
