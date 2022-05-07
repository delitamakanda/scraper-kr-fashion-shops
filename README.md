[![Fashion App CI](https://github.com/delitamakanda/koreanfashion/actions/workflows/django.yml/badge.svg?branch=main&event=push)](https://github.com/delitamakanda/koreanfashion/actions/workflows/django.yml)

```bash
python3 -m venv koreanfashion
source koreanfashion/bin/activate

django-admin startproject scraper .
django-admin startapp core

or 

python3 manage.py runserver
celery -A scraper worker -l info
```

## Crawler maybe-baby.co.kr
```bash
python3 core/crawler.py headless
```

## Crawler en.stylenanda.com
```bash
python3 core/crawler_stylenanda.py headless
```

## Populate products in db
```bash
python3 manage.py crawler output.csv --baseurl=https://en.maybe-baby.co.kr
python3 manage.py crawler output2.csv --baseurl=https://en.stylenanda.com
```

## Tests
```bash
python3 -m pytest test/test_crawler.py
python3 -m pytest test/test_crawler_mock.py
```

## Celery
```bash
celery -A scraper worker -l info
```

## Celery with beat
```bash
celery -A scraper worker -l info --beat
```
