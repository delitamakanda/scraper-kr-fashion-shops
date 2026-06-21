import csv
from decimal import Decimal
import os

from django.apps import apps
from django.core.management.base import BaseCommand, CommandError

from core.models import Product, SyncJobStatus
from core.services.sync_job_services import SyncJobService
from logging import getLogger
logger = getLogger(__name__)


class Command(BaseCommand):
    help = (
        "Import products from a local csv",
        "from external site : https://en.maybe-baby.co.kr/ or https://en.stylenanda.com/ or https://en.frombeginning.kr/ or https://wonlog.co.kr/",
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.model_name = Product
        self.source = ""

    def import_from_mb_as_csv(self, data):
        logger.info(data)
        try:
            if not self.model_name.objects.filter(image_url=data["img"]).exists():
                self.model_name.objects.create(
                    name=data["title"],
                    image_url=data["img"],
                    price=Decimal(data["price"]),
                    external_link=data["url"],
                    source=data["source"],
                    is_featured=True,
                )


            else:
                logger.info('no product found')
        except Exception as e:
            raise CommandError(
                "Error in inserting {}: {}".format(self.model_name, str(e))
            )

    @staticmethod
    def get_current_app_path():
        return apps.get_app_config("core").path

    def get_csv_file(self, filename):
        app_path = self.get_current_app_path()
        file_path = os.path.join(app_path, filename)
        return file_path

    def add_arguments(self, parser):
        parser.add_argument(
            "filenames", nargs="*", type=str, help="Inserts Products from CSV file"
        )

        parser.add_argument(
            "--baseurl", nargs="*", type=str, help="choose a website to scrape"
        )

    def handle(self, *args, **options):
        if options['baseurl'][0] == "https://en.maybe-baby.co.kr":
            self.source = "Maybe Baby"
        elif options['baseurl'][0] == "https://en.stylenanda.com":
            self.source = "Stylenanda"
        elif options['baseurl'][0] == "https://en.frombeginning.kr":
            self.source = "Frombeginning"
        elif options['baseurl'][0] == "https://wonlog.co.kr":
            self.source = "Wonlog"
        SyncJobService.record(status=SyncJobStatus.NEW,
                              source=self.source)
        for filename in options["filenames"]:
            self.stdout.write(self.style.SUCCESS(
                "Reading:{}".format(filename)))
            file_path = self.get_csv_file(filename)
            try:
                with open(file_path) as csv_file:
                    csv_reader = csv.reader(csv_file, delimiter=",")
                    SyncJobService.record(status=SyncJobStatus.IN_PROGRESS, source=self.source)
                    for row in csv_reader:
                        if row != "":
                            words = [word.strip() for word in row]
                            title = words[1]
                            url = f"{options['baseurl'][0]}{words[3]}"
                            price = words[2]
                            if price == "일시품절":
                                price = "0.00"
                            img = words[0]
                            data = {}
                            data["source"] = self.source
                            data["url"] = url
                            data["title"] = title
                            data["img"] = img
                            data["price"] = price.replace("$", "")
                            data["url"] = url
                            self.import_from_mb_as_csv(data)
                            self.stdout.write(
                                self.style.SUCCESS("{}".format(title)))
                SyncJobService.record(
                    status=SyncJobStatus.COMPLETED,
                    source=self.source
                )
            except FileNotFoundError:
                SyncJobService.record(
                    status=SyncJobStatus.FAILED,
                    source=self.source
                )
                raise CommandError("File {} does not exist".format(file_path))
