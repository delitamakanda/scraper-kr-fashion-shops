import sys
import os
import datetime
from time import sleep, time
from pathlib import Path

from scrapers.scrapers_stylenanda import get_driver, connect_to_base, parse_html, write_to_file

BASE_DIR = Path(__file__).resolve(strict=True).parent.parent

def run_process(filename, browser):
    if connect_to_base(browser):
        sleep(2)
        html = browser.page_source
        output_list = parse_html(html)
        write_to_file(output_list, filename)
    else:
        print("Error connecting to Stylenanda")


if __name__ == "__main__":

    # headless mode?
    headless = False
    if len(sys.argv) > 1 and sys.argv[1] == "headless":
        print("Running in headless mode")
        headless = True

    # set variables
    start_time = time()
    current_attempt = 1
    output_timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    if os.path.isfile(Path(BASE_DIR).joinpath('core/output2.csv')):
        os.remove(Path(BASE_DIR).joinpath('core/output2.csv'))
    output_filename = "output2.csv"

    # init browser
    browser = get_driver(headless=headless)

    # scrape and crawl
    while current_attempt <= 3:
        print(f"Scraping Stylenanda #{current_attempt} time(s)...")
        run_process(output_filename, browser)
        current_attempt = current_attempt + 1

    # exit
    browser.quit()
    end_time = time()
    elapsed_time = end_time - start_time
    print(f"Elapsed run time: {elapsed_time} seconds")