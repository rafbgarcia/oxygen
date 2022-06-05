from o2.models import Widget
from o2.widgets.pivot import Pivot
from o2.widgets.vertical_bar_chart import VerticalBarChart

_BUILDERS = {
    Widget.Types.PIVOT_TABLE: Pivot,
    Widget.Types.VERTICAL_BAR_CHART: VerticalBarChart,
}


def build_widget(widget):
    dataset = widget.dashboard.dataset
    return _builder_class(widget).metadata(dataset, widget.build_info)


def _builder_class(widget):
    return _BUILDERS[widget.type]
