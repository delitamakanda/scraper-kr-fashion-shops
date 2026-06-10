from django.urls import path
from apps.healthcheck.views import system_status, network_status, get_all_metrics_by_host, create_metrics, check_alerts, get_all_alerts

app_name = 'healthcheck'

urlpatterns = [
    path('system/status/', system_status, name='system_status'),
    path('ping/<str:host>/', network_status, name='ping_status'),
    path('hosts/<int:host_id>/metrics/', get_all_metrics_by_host, name='get_metrics_by_host'),
    path('metrics/', create_metrics, name='create_metrics'),
    path('alerts/check/', check_alerts, name='check_alerts'),
    path('alerts/', get_all_alerts, name='get_all_alerts'),  # Retrieve all active alerts for all hosts.
]