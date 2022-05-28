from o2.widgets.pivot import Pivot
from o2.widgets.vertical_bar_chart import VerticalBarChart

widget_mapping = {"pivot_table": Pivot, "vertical_bar_chart": VerticalBarChart}


def build_widget(widget):
    metadata = widget_mapping[widget["type"]](widget["build_info"]["build"], widget["dataset"]).metadata()

    return metadata
