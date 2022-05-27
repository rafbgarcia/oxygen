from django.urls import path
from o2 import dashboard_views, dataset_views, widget_views

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
    path("widgets/preview", widget_views.preview),
    path("widgets/<int:id>", widget_views.widget),
]

urlpatterns = [
    *dataset_paths,
    *dashboard_paths,
    *widget_paths,
]
