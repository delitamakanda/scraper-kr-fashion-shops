from .models import SyncJob
from django.utils import timezone

class SyncJobService:
    @staticmethod
    def record(
            *,
            status: str,
            source: str,
    ):
        return SyncJob.objects.create(
            status = status,
            source = source,
            imported_at = timezone.now(),
        )
