from django.db import models


class Host(models.Model):
    name = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField()
    is_active = models.BooleanField(default=True)
    last_checked_in = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.ip_address})"


class Metrics(models.Model):
    host = models.ForeignKey(Host, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    cpu_percentage = models.FloatField()
    ram_percentage = models.FloatField()
    disk_percentage = models.FloatField()
    is_healthy = models.BooleanField(default=True)

    def __str__(self):
        return f"Metrics for {self.host.name} at {self.timestamp}"


class Alert(models.Model):
    host = models.ForeignKey(Host, on_delete=models.CASCADE)
    metric_type = models.CharField(
        choices=[("CPU", "CPU"), ("RAM", "RAM"), ("DISK", "DISK")], max_length=4
    )
    threshold = models.FloatField()
    operator = models.CharField(choices=[(">", "Greater Than"), ("<", "Less Than")], max_length=4)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return (
            f"Alert for {self.host.name} on {self.metric_type} ({self.operator} {self.threshold})"
        )
