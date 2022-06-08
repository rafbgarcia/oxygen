import json
from django.forms import model_to_dict
from django.http import JsonResponse
import humps
from o2.models import Widget
from django.views.decorators.csrf import csrf_exempt
from o2.widgets.widget_builder import WidgetBuilder


@csrf_exempt
def preview(request, dashboard_id):
    params = humps.decamelize(json.loads(request.body))
    widget = Widget(build_info=params["build_info"], type=params["type"])

    return JsonResponse({"meta": WidgetBuilder.build(widget)})


@csrf_exempt
def create(request, dashboard_id):
    params = humps.decamelize(json.loads(request.body))
    widget = Widget.objects.create(**params, dashboard_id=dashboard_id)

    return JsonResponse({"widget": model_to_dict(widget)})
