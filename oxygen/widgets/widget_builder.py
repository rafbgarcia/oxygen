from operator import itemgetter

from oxygen.models.widget import Widget
from oxygen.widgets.sql_builder import SQLBuilder
import pantab_server.pantab_client as pantab


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
        if not _can_build_pivot(build):
            return None

        df = _dataframe(build, dataset)
        df = df.astype("object")

        if len(values_aliases) == 0:
            return {
                "html": df.pivot(index=rows_aliases, columns=columns_aliases, values=values_aliases).to_html(
                    escape=False, na_rep="-", index_names=True
                )
            }

        pivot = df.pivot_table(
            values=values_aliases,
            index=rows_aliases,
            columns=columns_aliases,
            aggfunc="sum",
            margins=True,
            margins_name="Grand Total",
        )
        if len(rows_aliases) > 0 and not build.get("row_totals"):
            pivot = pivot.iloc[:-1, :]

        if len(columns_aliases) > 0 and not build.get("column_totals"):
            pivot = pivot.iloc[:, :-1]

        # if len(columns_aliases) > 0:
        #     # Swap the first column with the values table row
        #     pivot = pivot.swaplevel(0, len(columns_aliases), axis="columns").sort_index(axis="columns")

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

        return {
            "datasets": [
                {
                    "label": labels[i],
                    "data": [v[i] for v in values],
                    "backgroundColor": "rgb(0,86,207)",
                }
                for (i, _) in enumerate(labels)
            ],
            "labels": xaxis,
        }


def _can_build_pivot(build):
    rows, columns, values = itemgetter("rows", "columns", "values")(build)
    if len(rows) > 0:
        return True
    if len(columns) > 0 and len(values) > 0:
        return True
    return False


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

    print(f">>> QUERY: {query}")
    return pantab.query(dataset["file_name"], query)
