from o2.widgets.pivot import Pivot


class VerticalBarChart:
    @classmethod
    def metadata(klass, dataset, build_info):
        pivot = Pivot.build(dataset, build_info)
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
