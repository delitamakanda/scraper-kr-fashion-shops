web: gunicorn scraper.wsgi:application --preload --log-file -
worker: celery -A scraper worker beat -l info --without-gossip --without-mingle --without-heartbeat
release: python manage.py migrate