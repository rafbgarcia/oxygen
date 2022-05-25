from django.urls import path

from . import views

urlpatterns = [
    path('datasets/create', views.create_dataset, name='create_dataset'),
    path('dashboards/<int:id>', views.dashboard, name='dashboard'),
    path('widgets/<int:id>', views.widget, name='widget'),
]
