from django.urls import path

from . import views

urlpatterns = [
    path("datasets", views.datasets),
    path("datasets/preview", views.preview_dataset),
    path("datasets/create", views.create_dataset),
    path("dashboards/<int:id>", views.dashboard),
    path("widgets/<int:id>", views.widget),
]
