from apps.healthcheck.services.alert_service import AlertService

class AlertSelectors:
    @staticmethod
    def get_active_alerts():
        alert_service = AlertService()
        return alert_service.list_alerts()
    