from apps.healthcheck.models import Host, Metrics


class HostService:
    @staticmethod
    def get_host_metrics_history(host: Host):
        return Metrics.objects.filter(host=host).order_by("-timestamp")
