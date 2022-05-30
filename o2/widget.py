from o2.widgets.pivot import Pivot
from o2.widgets.vertical_bar_chart import VerticalBarChart

widget_mapping = {"pivot_table": Pivot, "vertical_bar_chart": VerticalBarChart}


def build_widget(widget):
    widget_class = widget_mapping[widget["type"]]
    build_info = widget["build_info"]["build"]
    dataset = widget["dataset"]
    metadata = widget_class.metadata(dataset, build_info)

    return metadata
