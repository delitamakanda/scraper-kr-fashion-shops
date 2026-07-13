from datetime import timedelta
from logging import getLogger

from django.core.management.base import BaseCommand
from django.utils import timezone

from core.models import Product, SyncJob

logger = getLogger(__name__)

class Command(BaseCommand):
	help = 'Clears products older than 365 days from today'

	def add_arguments(self, parser):
		parser.add_argument('duration')

	def handle(self, *args, **options):
		if options['duration'] == 'month':
			number_of_days = 30
		elif options['duration'] == '3month':
			number_of_days = 90
		elif options['duration'] == '6month':
			number_of_days = 180
		elif options['duration'] == '1year':
			number_of_days = 365
		else:
			number_of_days = 30

		self.stdout.write(self.style.SUCCESS(f'Number of days to delete "{number_of_days}"'))
		logger.info(f'Number of days to delete "{number_of_days}"')

		today = timezone.now()
		past_date = today - timedelta(days=number_of_days)

		# this ensures we don't bother running through already marked true
		# objects as deleted.
		to_delete = Product.objects.filter(available=True, created__lte=past_date, is_featured=False)

		for item in to_delete:
			item.delete()
			
		# delete sync jobs
		sync_job_to_delete = SyncJob.objects.filter(imported_at__lte=past_date)
		
		for item in sync_job_to_delete:
			item.delete()
		
		logger.info(f'Removed "{to_delete}"')
		logger.info(f'Sync job removed "{sync_job_to_delete}"')
		self.stdout.write(self.style.SUCCESS(f'Removed "{to_delete}"'))