import csv
import sys
import os
import chromedriver_autoinstaller
from pathlib import Path

import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
if os.environ.get('DEBUG') == False:
    chromedriver_autoinstaller.install()

BASE_DIR = Path(__file__).resolve(strict=True).parent.parent


def get_driver(headless):
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    if (headless):
        print(headless)

    # init driver
    # only for debug
    if len(sys.argv) > 1:
        if sys.argv[1] == "headless":
            driver = webdriver.Chrome(ChromeDriverManager().install())
    else:
        driver = webdriver.Chrome(chrome_options=options)
    return driver


def connect_to_base(browser):
    base_url = 'http://en.maybe-baby.co.kr'
    connection_attempts = 0
    while connection_attempts < 3:
        try:
            browser.get(base_url)
            # wait for item element with id 'contents' to load
            # before returning True
            WebDriverWait(browser, 5).until(
                EC.presence_of_element_located((By.ID, 'contents'))
            )
            return True
        except Exception as e:
            print(e)
            connection_attempts += 1
            print(f'Error connecting to {base_url}')
            print(f'Attempt #{connection_attempts}')
    return False


def parse_html(html):
    # create soup object
    soup = BeautifulSoup(html, 'html.parser')
    output_list = []
    for row in soup.find_all('div', {"class": "box"}):
        if row.find('p', attrs= {'class': 'name'}) is not None:
            article = {}
            article['img'] = row.img['src']
            article['title'] = row.find('p', class_='name').find_all('span')[2].text
            article['url'] = row.find('p', class_='name').a['href']
            article['price'] = row.find('li', class_='xans-record-').find_all('span')[1].text
            output_list.append(article)
            print(article)
    return output_list


def get_load_time(article_url):
    try:
        # set headers
        headers = {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Mobile Safari/537.36'
        }
        # make get request to article_url
        response = requests.get(
            article_url, headers=headers, stream=True, timeout=3.000
        )
        # get page load time
        load_time = response.elapsed.total_seconds()
    except Exception as e:
        print(e)
        load_time = 'Loading Error'
    return load_time


def write_to_file(output_list, filename):
    with open(Path(BASE_DIR).joinpath(filename), 'w', newline='') as csvfile:
        for row in output_list:
            fieldnames = ['img', 'title', 'price', 'url']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writerow(row)