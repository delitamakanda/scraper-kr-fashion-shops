import csv
import os
from decimal import Decimal, InvalidOperation
from logging import getLogger
from pathlib import Path
from urllib.parse import urljoin

from django.apps import apps
from django.core.management.base import BaseCommand, CommandError

from core.models import Product, SyncJobStatus
from core.services.sync_job_services import SyncJobService

logger = getLogger(__name__)

SOURCE_MAPPING = {
    "https://en.maybe-baby.co.kr": "Maybe Baby",
    "https://en.frombeginning.kr": "Frombeginning",
    "https://wonlog.co.kr": "Wonlog",
}


class Command(BaseCommand):
    help = (
        "Import products from a local csv",
        "from external site : https://en.maybe-baby.co.kr/ or https://en.frombeginning.kr/ or https://wonlog.co.kr/",
    )

    def add_arguments(self, parser):
        parser.add_argument("filename", type=str, help="Inserts Products from CSV file")
        parser.add_argument("--baseurl", required=True, type=str, help="choose a website to scrape")

    @staticmethod
    def get_current_app_path() -> Path:
        return Path(apps.get_app_config("core").path)

    def handle(self, *args, **options):
        filename = options["filename"]
        base_url = options["baseurl"].rstrip("/")
        source = SOURCE_MAPPING.get(base_url)

        if source is None:
            raise CommandError(f"Invalid base URL: {base_url}")

        file_path = self.get_current_app_path() / filename

        SyncJobService.record(status=SyncJobStatus.NEW, source=source)

        try:
            with file_path.open("r", encoding="utf-8", newline="") as csv_file:
                reader = csv.DictReader(csv_file)

                self.validate_headers(reader.fieldnames)

                SyncJobService.record(status=SyncJobStatus.IN_PROGRESS, source=source)

                imported_count = 0

                for line_number, row in enumerate(reader, start=2):
                    product = self.normalize_row(
                        row=row,
                        base_url=base_url,
                        line_number=line_number,
                        source=source,
                    )

                    Product.objects.update_or_create(
                        source=product["source"],
                        external_link=product["url"],
                        defaults={
                            "name": product["title"],
                            "image_url": product["img"],
                            "price": product["price"],
                            "is_featured": True,
                        },
                    )

                    imported_count += 1

            SyncJobService.record(status=SyncJobStatus.COMPLETED, source=source)

        except FileNotFoundError as e:
            SyncJobService.record(status=SyncJobStatus.FAILED, source=source)
            raise CommandError(f"File {filename} does not exist") from e

        except Exception as e:
            SyncJobService.record(status=SyncJobStatus.FAILED, source=source)
            raise CommandError(f"Error importing {filename}: {e}") from e

        self.stdout.write(self.style.SUCCESS(f"Imported {imported_count} products from {filename}"))

    @staticmethod
    def normalize_row(*, row, base_url, line_number, source):
        title = row["title"].strip()
        image_url = row["img"].strip()
        relative_url = row["url"].strip()
        raw_price = row["price"].strip()

        if not title:
            raise CommandError(f"Invalid title on line {line_number}")

        try:
            price = Decimal(raw_price.replace(",", "").replace("$", "").strip())
        except InvalidOperation as e:
            raise CommandError(f"Invalid price on line {line_number}: {e}") from e

        return {
            "source": source,
            "url": urljoin(f"{base_url}/", relative_url),
            "title": title,
            "img": image_url,
            "price": price,
        }

    @staticmethod
    def validate_headers(fieldnames):
        expected_headers = {"img", "title", "price", "url"}
        actual_headers = set(fieldnames or [])

        missing_headers = expected_headers - actual_headers

        if missing_headers:
            raise CommandError(f"Missing headers in CSV file: {', '.join(missing_headers)}")
