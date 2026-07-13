import logging
from time import perf_counter

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

logger = logging.getLogger(__name__)

SELECTOR_TYPES = {
    "id": By.ID,
    "css": By.CSS_SELECTOR,
    "xpath": By.XPATH,
}


def run_scraper(config, parser, driver):
    start = perf_counter()
    
    try:
        driver.get(config.base_url)
        
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located(
                (
                    SELECTOR_TYPES[config.wait_selector_type],
                    config.wait_selector_value,
                )
            )
        )
        
        products = parser(driver.page_source)
        logger.info(f"Scraped {len(products)} products from {config.name}")
        return products
    
    finally:
        elapsed = perf_counter() - start
        logger.info(f"Elapsed time for {config.name} : {elapsed:.2f} seconds")
