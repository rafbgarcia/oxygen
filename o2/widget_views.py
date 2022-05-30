import json
from django.forms import model_to_dict
from django.http import JsonResponse
import humps
from o2.models import Dashboard, Widget
from django.views.decorators.csrf import csrf_exempt
from o2.widget import build_widget


@csrf_exempt
def preview(request):
    params = humps.decamelize(json.loads(request.body))
    widget = {
        "dataset": params["dataset"],
        "build_info": params["build_info"],
        "type": params["type"],
    }
    metadata = build_widget(widget)

    return JsonResponse({"meta": metadata})


@csrf_exempt
def create(request):
    params = humps.decamelize(json.loads(request.body))
    widget = Widget.objects.create(**params)

    return JsonResponse({"widget": model_to_dict(widget)})


def widget(request, id):
    dash = Dashboard.objects.first()
    widget = dash.grid_rows[0]["widgets"][0]
    widget["dataset"] = {
        "fields": [
            {"name": "application_id", "type": "number"},
            {"name": "follow_up_number", "type": "number"},
            {"name": "follow_up_date", "type": "datetime"},
            {"name": "follow_up_date_string", "type": "string"},
            {"name": "follow_up_result", "type": "string"},
            {"name": "resulted_by", "type": "string"},
            {"name": "title_name", "type": "string"},
        ]
    }
    return JsonResponse(humps.camelize(widget))
