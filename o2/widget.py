from o2.widgets.pivot import Pivot
from django.views.decorators.csrf import csrf_exempt

widget_mapping = {"pivot_table": Pivot}


def build_widget(widget):
    metadata = widget_mapping[widget["type"]](widget["build_info"]["build"], widget["dataset"]).metadata()

    return metadata
