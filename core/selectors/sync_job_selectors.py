from core.services.sync_job_services import SyncJobService


class SyncJobSelector:
    @staticmethod
    def get_last_sync_job():
        return SyncJobService.get_last_sync_job()
    
    @staticmethod
    def get_last_five_sync_jobs():
        return SyncJobService.get_last_five_sync_jobs()
        