from logging import getLogger

from apps.healthcheck.models import Alert, Host, Metrics

logger = getLogger(__name__)


def send_alert(host, metric_type, current_value):
    logger.info(f"Alert triggered for {host.name} on {metric_type} ({current_value}%)")
    # Implement sending alert logic here
    # Example: Send email, SMS, or push notification

class AlertService:
    @staticmethod
    def check_alerts_for_host():
        hosts = Host.objects.filter(is_active=True)
        for host in hosts:
            alerts = Alert.objects.filter(host=host, is_active=True)
            latest_metric = Metrics.objects.filter(host=host).order_by('-timestamp').first()
            for alert in alerts:
                current_value = getattr(latest_metric, f"{alert.metric_type}_percentage")
                if (alert.operator == '>' and current_value > alert.threshold) or (alert.operator == '<' and current_value < alert.threshold):
                    send_alert(host, alert.metric_type, current_value)
    
        
    @staticmethod
    def list_alerts():
        alerts = Alert.objects.filter(is_active=True).order_by('host', 'metric_type')
        return alerts
        