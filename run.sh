#!/bin/sh
gunicorn scraper.wsgi --log-file -
