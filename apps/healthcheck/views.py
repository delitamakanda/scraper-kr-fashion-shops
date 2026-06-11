import time
from django.http import JsonResponse
from apps.healthcheck.utils.system import get_system_status
from apps.healthcheck.utils.network import ping_host
from apps.healthcheck.serializers import MetricsSerializer, AlertSerializer
from apps.healthcheck.services.metric_service import MetricService
from apps.healthcheck.models import Host
from apps.healthcheck.selectors.host_selectors import HostSelectors
from apps.healthcheck.selectors.alert_selectors import AlertSelectors
from apps.healthcheck.services.alert_service import AlertService
from apps.healthcheck.services.network_service import NetworkService

def check_alerts(request):
    AlertService().check_alerts_for_host()
    return JsonResponse([AlertSerializer.serialize(alert) for alert in AlertSelectors.get_active_alerts()], safe=False)

def get_all_alerts(request):
    alerts = AlertSelectors.get_active_alerts()
    return JsonResponse([AlertSerializer.serialize(alert) for alert in alerts], safe=False)

def get_all_metrics_by_host(request, host_id):
    host = Host.objects.get(id=host_id)
    metrics = HostSelectors.get_all_metrics_by_host(host)
    return JsonResponse([MetricsSerializer.serialize(metrics) for metrics in metrics], safe=False)

def create_metrics(request):
    if request.method == 'POST':
        host = Host.objects.get(name=request.POST.get('host_id'))
        cpu_usage = request.POST.get('cpu_usage')
        memory_usage = request.POST.get('memory_usage')
        disk_usage = request.POST.get('disk_usage')
        metric_service = MetricService()
        metric = metric_service.create_metric(host, time.time(), cpu_usage, memory_usage, disk_usage)
        return JsonResponse(MetricsSerializer.serialize(metric))
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def system_status(request):
    data = get_system_status()
    return JsonResponse(data)

def network_status(request, host):
    network_service = NetworkService()
    host, port = host.split(':')
    reachable_hosts = network_service.is_host_reachable(host, int(port))
    start_time = time.time()
    time.sleep(1)  # simulate heavy load
    return JsonResponse({'reachable': reachable_hosts, 'host': host, 'port': port, 'load_time': time.time() - start_time})
