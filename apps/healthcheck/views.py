import time
from django.http import JsonResponse
from apps.healthcheck.utils.system import get_system_status
from apps.healthcheck.utils.network import ping_host

def system_status(request):
    data = get_system_status()
    return JsonResponse(data)

def network_status(request, host):
    reachable_hosts = ping_host(host)
    start_time = time.time()
    time.sleep(1)  # simulate heavy load
    return JsonResponse({'reachable': reachable_hosts, 'host': host, 'load_time': time.time() - start_time})