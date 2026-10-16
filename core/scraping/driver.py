import logging
import os

from selenium import webdriver

logger = logging.getLogger(__name__)


def build_chrome_driver(*, headless: bool = True) -> webdriver.Chrome:
    logger.info(f"Starting Chrome driver (headless={headless})...")

    options = webdriver.ChromeOptions()

    if headless:
        options.add_argument("--headless=new")

    options.add_argument("--no-sandbox")
    options.add_argument("--disable-gpu")
    options.add_argument("--lang=ko_KR")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-dev-shm-usage")

    options.add_argument(
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/138.0 Safari/537.36"
    )

    # In Docker, Chrome runs in the selenium container (see docker-compose.yml)
    remote_url = os.getenv("SELENIUM_REMOTE_URL")
    if remote_url:
        logger.info(f"Using remote Selenium at {remote_url}")
        return webdriver.Remote(command_executor=remote_url, options=options)

    return webdriver.Chrome(options=options)
