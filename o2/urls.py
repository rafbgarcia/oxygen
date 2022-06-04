from django.urls import path
from o2 import dashboard_views, dataset_views, widget_views

from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from o2.graphql.schema import schema

dataset_paths = [
    path("datasets", dataset_views.index),
    path("datasets/preview", dataset_views.preview),
    path("datasets/create", dataset_views.create),
]

dashboard_paths = [
    path("dashboards", dashboard_views.index),
    path("dashboards/create", dashboard_views.create),
    path("dashboards/<int:id>", dashboard_views.show),
]

widget_paths = [
    path("dashboards/<int:dashboard_id>/widgets/preview", widget_views.preview),
    path("dashboards/<int:dashboard_id>/widgets/create", widget_views.create),
]

urlpatterns = [
    *dataset_paths,
    *dashboard_paths,
    *widget_paths,
    path("", csrf_exempt(GraphQLView.as_view(graphiql=True, schema=schema))),
]
