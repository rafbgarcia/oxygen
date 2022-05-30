import json
from django.forms import model_to_dict
from django.http import JsonResponse
import humps
from o2.models import Dashboard, DashboardRow, Dataset, Widget
from django.views.decorators.csrf import csrf_exempt


def index(request):
    dashboards = [model_to_dict(dash) for dash in Dashboard.objects.all()]
    return JsonResponse(humps.camelize({"dashboards": dashboards}))


@csrf_exempt
def create(request):
    params = json.loads(request.body)
    dashboard = Dashboard.objects.create(**params)
    return JsonResponse(model_to_dict(dashboard))


def show(request, id):
    dashboard = Dashboard.objects.get(pk=id)
    rows = DashboardRow.objects.filter(dashboard_id=dashboard.id).order_by("index")
    widgets = list(Widget.objects.filter(dashboard_row__in=rows).select_related("dataset").all())
    for (i, widget) in enumerate(widgets):
        widgets[i] = model_to_dict(widget)
        widgets[i]["dataset"] = model_to_dict(widget.dataset)
        widgets[i]["meta"] = widget.metadata()

    return JsonResponse(
        humps.camelize(
            {
                "dashboard": model_to_dict(dashboard),
                "rows": list(rows.all().values()),
                "widgets": widgets,
            }
        )
    )
