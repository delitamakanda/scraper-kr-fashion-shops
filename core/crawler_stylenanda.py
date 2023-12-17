import sys
import os
import datetime
from time import sleep, time
from pathlib import Path

from scrapers.scrapers_stylenanda import get_driver, connect_to_base, parse_html, write_to_file

BASE_DIR = Path(__file__).resolve(strict=True).parent.parent

def run_process(filename, browser, baseurl):
    if connect_to_base(browser, baseurl):
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

    # scrape beauty products from stylenanda #3ce
    baseurl = 'https://stylenanda.com/category/fashion/1902/'
    if len(sys.argv) > 2 and sys.argv[2] == "baseurl" or len(sys.argv) > 1 and sys.argv[1] == "baseurl":
        print("Running from 3ce")
        baseurl = 'https://stylenanda.com/category/beauty/1784/'

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
        run_process(output_filename, browser, baseurl)
        current_attempt = current_attempt + 1

    # exit
    browser.quit()
    end_time = time()
    elapsed_time = end_time - start_time
    print(f"Elapsed run time: {elapsed_time} seconds")