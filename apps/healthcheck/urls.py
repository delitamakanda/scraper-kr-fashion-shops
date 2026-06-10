from django.urls import path
from apps.healthcheck.views import system_status, network_status

app_name = 'healthcheck'

urlpatterns = [
    path('system/status/', system_status, name='system_status'),
    path('ping/<str:host>/', network_status, name='ping_status'),
]