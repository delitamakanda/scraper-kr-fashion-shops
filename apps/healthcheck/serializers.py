from django.forms.models import model_to_dict

class HostSerializer:
    @staticmethod
    def serialize(instance):
        data = model_to_dict(instance, fields=[
            'id',
            'name',
            'ip_address',
            'is_active',
            'last_checked_in',
        ])
        return data
    
class MetricsSerializer:
    @staticmethod
    def serialize(instance):
        data = model_to_dict(instance, fields=[
            'id',
            'timestamp',
            'cpu_percentage',
            'ram_percentage',
            'disk_percentage',
            'is_healthy',
            'host',
        ])
        data['host'] = HostSerializer.serialize(instance.host)
        return data
    

class AlertSerializer:
    @staticmethod
    def serialize(instance):
        data = model_to_dict(instance, fields=[
            'id',
            'metric_type',
            'threshold',
            'operator',
            'is_active',
            'host',
        ])
        return data