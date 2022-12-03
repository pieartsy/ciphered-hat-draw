from django.urls import path

from . import views

app_name = 'hatdraw'
urlpatterns = [
    path('', views.index, name='index'),
    path('assignTasks/', views.assignTasks, name='assignTasks'),
]