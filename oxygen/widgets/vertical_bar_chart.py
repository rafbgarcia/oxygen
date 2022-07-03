import uuid
from oxygen.widgets.pivot import Pivot


class VerticalBarChart:
    @classmethod
    def metadata(klass, dataset, build_info):
        pivot = Pivot.build(dataset=dataset, build_info=build_info)
        if pivot is None:
            return None

        values = pivot.values.tolist()
        labels = pivot.columns.tolist()
        xaxis = pivot.index.tolist()
        id = uuid.uuid4()

        return {
            "datasets": [
                {"label": labels[i], "data": [v[i] for v in values], "backgroundColor": "rgb(0,86,207)"}
                for (i, _) in enumerate(labels)
            ],
            "labels": xaxis,
            "id": f"dashboard-{id}",
        }
