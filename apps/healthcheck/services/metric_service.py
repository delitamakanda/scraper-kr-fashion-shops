from apps.healthcheck.models import Metrics


class MetricService:
    @staticmethod
    def create_metric(host, timestamp, cpu_usage, memory_usage, disk_usage):
        metric = Metrics.objects.create(
            host=host,
            timestamp=timestamp,
            cpu_percentage=cpu_usage,
            ram_percentage=memory_usage,
            disk_percentage=disk_usage,
        )
        return metric
