from logging import getLogger

from django.utils import timezone

from core.models import SyncJob

logger = getLogger(__name__)


class SyncJobService:
    @staticmethod
    def record(
        *,
        status: str,
        source: str,
    ):
        logger.info(f"Sync job status: {status}")
        return SyncJob.objects.create(
            status=status,
            source=source,
            imported_at=timezone.now(),
        )

    @staticmethod
    def get_last_sync_job():
        logger.info("Getting last sync job")
        return SyncJob.objects.order_by("-imported_at").first()

    @staticmethod
    def get_last_five_sync_jobs():
        return SyncJob.objects.order_by("-imported_at")[:5]
