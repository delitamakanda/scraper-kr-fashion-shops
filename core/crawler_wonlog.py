import sys
import os
import datetime
import logging
from time import sleep, time
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from scrapers.scrapers_wonlog import get_driver, connect_to_base, parse_html, write_to_file, is_site_accessible

BASE_DIR = Path(__file__).resolve(strict=True).parent.parent

def run_process(filename, browser):
    if not is_site_accessible('https://wonlog.co.kr/product/list.html?cate_no=58'):
        logger.error(f'the site is currently unavailable. Please try again later.')
    if connect_to_base(browser):
        sleep(2)
        html = browser.page_source
        output_list = parse_html(html)
        write_to_file(output_list, filename)
    else:
        print("Error connecting to wonlog")


if __name__ == "__main__":

    # headless mode?
    headless = False
    if len(sys.argv) > 1 and sys.argv[1] == "headless":
        print("Running in headless mode")
        headless = True

    # set variables
    start_time = time()
    output_timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    if os.path.isfile(Path(BASE_DIR).joinpath('core/output4.csv')):
        os.remove(Path(BASE_DIR).joinpath('core/output4.csv'))
    output_filename = "output4.csv"

    # init browser
    browser = get_driver(headless=headless)

    # scrape and crawl
    run_process(output_filename, browser)

    # exit
    browser.quit()
    end_time = time()
    elapsed_time = end_time - start_time
    print(f"Elapsed run time: {elapsed_time} seconds")