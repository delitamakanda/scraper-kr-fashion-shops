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

## Populate products in db
```bash
python3 manage.py crawler output.csv
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
