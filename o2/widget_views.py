import json
from django.forms import model_to_dict
from django.http import JsonResponse
import humps
from o2.models import Dataset, Widget
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def preview(request, dashboard_id):
    params = humps.decamelize(json.loads(request.body))
    widget = Widget(build_info=params["build_info"], type=params["type"])
    dataset = Dataset.objects.get(pk=params["dataset"]["id"])

    return JsonResponse({"meta": widget.metadata(dataset)})


@csrf_exempt
def create(request, dashboard_id):
    params = humps.decamelize(json.loads(request.body))
    widget = Widget.objects.create(**params, dashboard_id=dashboard_id)

    return JsonResponse({"widget": model_to_dict(widget)})
