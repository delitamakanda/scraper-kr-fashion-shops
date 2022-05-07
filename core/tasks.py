from celery import shared_task
from celery.utils.log import get_task_logger
from django.core.management import call_command

logger = get_task_logger(__name__)


@shared_task
def sample_task():
    logger.info("The sample task just ran.")


@shared_task
def populate_maybe_baby_products():
    call_command("crawler", "output.csv", "--baseurl=https://en.maybe-baby.co.kr")

@shared_task
def populate_stylenanda_products():
    call_command("crawler", "output2.csv", "--baseurl=https://en.stylenanda.com")
