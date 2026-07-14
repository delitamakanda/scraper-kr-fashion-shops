from logging import getLogger

from django.core.management.base import BaseCommand

from core.scraping.config import SCRAPERS
from core.scraping.csv_writer import write_to_file
from core.scraping.driver import build_chrome_driver
from core.scraping.parsers import PARSERS
from core.scraping.runner import run_scraper

logger = getLogger(__name__)


class Command(BaseCommand):
    help = "Scrapes products from a website and saves them to a CSV file"

    def add_arguments(self, parser):
        parser.add_argument(
            "shop",
            choices=SCRAPERS.keys(),
        )

    def handle(self, *args, **options):
        shop = options["shop"]

        config = SCRAPERS[shop]
        parser = PARSERS[shop]

        driver = build_chrome_driver()

        try:
            products = run_scraper(
                config=config,
                parser=parser,
                driver=driver,
            )

            write_to_file(products, config.output_filename)
            logger.info(f"Products saved to {config.output_filename}")

        finally:
            driver.quit()
