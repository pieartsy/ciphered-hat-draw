from django.urls import path, include
from .models import Assignment
from rest_framework import routers, serializers, viewsets

from . import views

app_name = 'hatdraw'
urlpatterns = [
    path('', views.index, name='index'),
    path('assign_tasks/', views.assign_tasks, name='assign_tasks'),
]