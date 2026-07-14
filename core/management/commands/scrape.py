from logging import getLogger

from django.core.management.base import BaseCommand, CommandError

from core.scraping.config import SCRAPERS
from core.scraping.csv_writer import write_to_file
from core.scraping.driver import build_chrome_driver
from core.scraping.parsers import PARSERS
from core.scraping.runner import run_scraper

logger = getLogger(__name__)


class Command(BaseCommand):
    help = "Scrapes products from a website and saves them to a CSV file"

    def add_arguments(self, parser):
        parser.add_argument("shop", choices=SCRAPERS.keys(), help="Shop to scrape products from.")

        parser.add_argument(
            "--no-headless", action="store_true", help="Run Chrome in headless mode."
        )

    def handle(self, *args, **options):
        shop = options["shop"]
        headless = not options["no_headless"]

        config = SCRAPERS[shop]
        parser = PARSERS[shop]

        self.stdout.write(f"Scraping {config.name} products...")

        driver = build_chrome_driver(headless=headless)

        try:
            products = run_scraper(
                config=config,
                parser=parser,
                driver=driver,
            )

            write_to_file(products, config.output_filename)
            logger.info(f"Products saved to {config.output_filename}")
        except Exception as e:
            logger.exception(f"Error scraping {config.name}: {e}")
            raise CommandError(f"Error scraping {config.name}: {e}") from e

        finally:
            driver.quit()
