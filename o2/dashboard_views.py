import json
from django.forms import model_to_dict
from django.http import JsonResponse
import humps
from o2.models import Dashboard, Widget
from django.views.decorators.csrf import csrf_exempt


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
    widgets = list(Widget.objects.filter(dashboard=dashboard).all())
    for (i, widget) in enumerate(widgets):
        widgets[i] = model_to_dict(widget)
        widgets[i]["meta"] = widget.metadata(dashboard.dataset)

    return JsonResponse(
        humps.camelize(
            {
                "dashboard": model_to_dict(dashboard),
                "dataset": model_to_dict(dashboard.dataset),
                "widgets": widgets,
            }
        )
    )
