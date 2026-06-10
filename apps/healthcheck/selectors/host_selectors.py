from apps.healthcheck.services.host_service import HostService

class HostSelectors:
    @staticmethod
    def get_all_metrics_by_host(host):
        host_service = HostService()
        return host_service.get_host_metrics_history(host)