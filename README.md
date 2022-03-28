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