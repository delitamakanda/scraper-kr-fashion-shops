from core.models import SyncJob, SyncJobStatus
from django.utils import timezone

class SyncJobService:
    @staticmethod
    def record(
            *,
            status: SyncJobStatus,
            source: str,
    ):
        return SyncJob.objects.create(
            status = status,
            source = source,
            imported_at = timezone.now(),
        )
