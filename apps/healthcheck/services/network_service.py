from django.conf import settings

from apps.healthcheck.utils.network import ping_host, tcp_check


class NetworkService:
    @staticmethod
    def is_host_reachable(host: str, port: int) -> bool:
        if settings.MONITORING_USE_TCP_ONLY:
            return tcp_check(host, port)
        return ping_host(host)
