import csv
import sys
import os
import logging
import time
import random

import chromedriver_autoinstaller
from pathlib import Path

import requests
from bs4 import BeautifulSoup
from requests import RequestException
from selenium import webdriver
from selenium.common import TimeoutException, WebDriverException
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
if os.environ.get('DEBUG') == False:
    chromedriver_autoinstaller.install()

BASE_DIR = Path(__file__).resolve(strict=True).parent.parent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36'
]

def get_random_user_agent():
    return random.choice(USER_AGENTS)

def exponential_backoff(attempt, base_delay=5, max_delay=60):
    delay = min(base_delay * (2 ** attempt), max_delay)
    jitter = random.uniform(0, 0.1 * delay)
    return delay + jitter

def is_site_accessible(url, max_retries=3, delay=5):
    for attempt in (range(max_retries)):
        try:
            headers = {
                'User-Agent': get_random_user_agent()
            }
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                return True
            else:
                logger.warning(f'Attempt #{attempt+1} failed. Status code: {response.status_code}')
        except RequestException as e:
            logger.error(f'Attempt #{attempt+1} failed {e}')
        if attempt < max_retries - 1:
            delay = exponential_backoff(attempt)
            logger.info(f'Waiting for {delay} seconds before retrying...')
            time.sleep(delay)
            
    return False


def get_driver(headless):
    options = webdriver.ChromeOptions()
    options.add_argument('--headless=new')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-gpu')
    options.add_argument('--lang=ko_KR')
    options.add_argument('--window-size=1920,1080')
    options.add_argument(f'user-agent={get_random_user_agent()}')
    if (headless):
        print(headless)

    # init driver
    # only for debug
    if len(sys.argv) > 1:
        if sys.argv[1] == "headless":
            driver = webdriver.Chrome(ChromeDriverManager().install())
    else:
        driver = webdriver.Chrome(options=options)
    return driver


def connect_to_base(browser, max_attempts=5):
    base_url = 'https://wonlog.co.kr/product/list.html?cate_no=58'
    connection_attempts = 0
    for attempt in range(max_attempts):
        try:
            logger.info(f'Attempt #{attempt+1} to connect to {base_url}')
            browser.get(base_url)
            # wait for item element with id 'contents' to load
            # before returning True
            WebDriverWait(browser, 20).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, '.prdList'))
            )
            logger.info(f'Successfully connected to {base_url}')
            return True
        except (TimeoutException, WebDriverException) as e:
            logger.error(f'Error on attempt #{attempt+1}: {e}')
        
        if attempt < max_attempts - 1:
            delay = exponential_backoff(attempt)
            logger.info(f'Waiting for {delay:.2f} seconds before retrying...')
            time.sleep(delay)
    logger.error(f'Failed to connect to {base_url} after {max_attempts} attempts ')
    return False


def parse_html(html):
    # create soup object
    soup = BeautifulSoup(html, 'html.parser')
    output_list = []
    for row in soup.find_all('li', {"class": "xans-record-"}):
        if row.find('div', attrs= {'class': 'thumbnail'}) is not None:
            article = {}
            article['img'] = row.find('div', attrs= {'class': 'prdImg'}).img['src']
            article['title'] = row.find('div', class_='name').text.replace('\n', '')
            article['url'] = row.find('div', class_='thumbnail').a['href']
            article['price'] = row.find('li', class_='xans-record-').find_all('span')[1].text.replace(',', '.')
            output_list.append(article)
            logger.info(f'Parsed article: {article["title"]}')
    return output_list


def get_load_time(article_url):
    try:
        # set headers
        headers = {
            'User-Agent': get_random_user_agent()
        }
        # make get request to article_url
        response = requests.get(
            article_url, headers=headers, stream=True, timeout=5
        )
        # get page load time
        load_time = response.elapsed.total_seconds()
    except Exception as e:
        logger.error(f'Error while getting load time: {e}')
        load_time = 'Loading Error'
    return load_time


def write_to_file(output_list, filename):
    with open(Path(BASE_DIR).joinpath(filename), 'w', newline='') as csvfile:
        for row in output_list:
            fieldnames = ['img', 'title', 'price', 'url']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writerow(row)
    logger.info(f'Successfully wrote data to {filename}')
