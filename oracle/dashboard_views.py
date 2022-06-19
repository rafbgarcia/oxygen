import json
from django.forms import model_to_dict
from django.http import JsonResponse
import humps
from oracle.models import Dashboard, Widget
from django.views.decorators.csrf import csrf_exempt
from oracle.widgets.widget_builder import WidgetBuilder


def index(request):
    dashboards = [model_to_dict(dash) for dash in Dashboard.objects.all()]
    return JsonResponse(humps.camelize({"dashboards": dashboards}))


@csrf_exempt
def create(request):
    params = humps.decamelize(json.loads(request.body))
    dashboard = Dashboard.objects.create(**params)
    return JsonResponse(model_to_dict(dashboard))


def show(request, id):
    dashboard = Dashboard.objects.select_related("dataset").get(pk=id)
    tables = [model_to_dict(table) for table in list(dashboard.dataset.tables.all())]
    dataset = {**model_to_dict(dashboard.dataset), **{"tables": tables}}
    widgets = list(Widget.objects.filter(dashboard=dashboard).all())
    for (i, widget) in enumerate(widgets):
        widgets[i] = model_to_dict(widget)
        widgets[i]["meta"] = WidgetBuilder.build(widget)

    return JsonResponse(
        humps.camelize(
            {
                "dashboard": model_to_dict(dashboard),
                "dataset": dataset,
                "widgets": widgets,
            }
        )
    )
