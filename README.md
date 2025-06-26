# 🛍️ Korean Fashion Shops Scraper

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue)](https://www.python.org/downloads/)
[![Licence](https://img.shields.io/badge/Licence-MIT-green)](LICENSE)
[![Fashion App CI](https://github.com/delitamakanda/koreanfashion/actions/workflows/django.yml/badge.svg?branch=main&event=push)](https://github.com/delitamakanda/koreanfashion/actions/workflows/django.yml)

Un scraper simple pour collecter les produits et tendances des principales boutiques de mode coréennes.  
Utile pour la veille, l'analyse ou l'automatisation des données e-commerce.

---

## 🚀 Fonctionnalités

- Scraping des nouveautés et collections depuis :
  - [wonlog](https://wonlog.co.kr)
  - [Maybe Baby](https://en.maybe-baby.co.kr)
  - [frombeginning](https://en.frombeginning.kr)
  - D'autres sites à venir...
 
- Export des données en :
  - `.json`
  - `.csv`
 
- Structure modulaire, facilement extensible par site

---

## 📦 Installation

```bash
git clone https://github.com/delitamakanda/scraper-kr-fashion-shops.git
cd scraper-kr-fashion-shops
pip install -r requirements.txt
```

```bash
python3 -m venv koreanfashion
source koreanfashion/bin/activate

django-admin startproject scraper .
django-admin startapp core

or 

python3 manage.py runserver
celery -A scraper worker -l info
```

Optionnel : si des cookies ou des clés API sont nécessaires, créer un fichier .env à la racine :

```bash
MY_SECRET=xxx
ANOTHER_CONFIG=yyy
```

## 🔧 Utilisation
Exemple de lancement pour scraper un site précis :

### Crawler maybe-baby.co.kr
```bash
python3 core/crawler.py headless
```

### Crawler en.stylenanda.com
```bash
python3 core/crawler_stylenanda.py headless
```

### 3ce beauty products
```bash
python3 core/crawler_stylenanda.py headless baseurl
```

### Crawler en.frombeginning.com
```bash
python3 core/crawler_frombeginning.py headless
```

## Crawler en.wonlog.co.kr
```bash
python3 core/crawler_wonlog.py headless
```

### Populate products in db
```bash
python3 manage.py crawler output.csv --baseurl=https://en.maybe-baby.co.kr
python3 manage.py crawler output2.csv --baseurl=https://stylenanda.com
python3 manage.py crawler output3.csv --baseurl=https://en.frombeginning.kr
python3 manage.py crawler output4.csv --baseurl=https://wonlog.co.kr
```

### Tests
```bash
python3 -m pytest test/test_crawler.py
python3 -m pytest test/test_crawler_mock.py
```

### Celery
```bash
celery -A scraper worker -l info
```

### Celery with beat
```bash
celery -A scraper worker -l info --beat
```
### cron jobs
100	0 0 * * *	python3 manage.py crawler output4.csv --baseurl=https://wonlog.co.kr	
99	0 0 * * *	python3 manage.py crawler output3.csv --baseurl=https://en.frombeginning.kr	
98	0 0 * * *	python3 manage.py send_mail	
97	0 0 * * *	python3 manage.py deleteproduct 3month	
96	0 0 * * *	python3 manage.py crawler output.csv --baseurl=https://en.maybe-baby.co.kr

## 🛠️ Roadmap
- Support d'autres shops coréens

