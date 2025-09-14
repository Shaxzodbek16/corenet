#!/bin/bash

set -e

python mange.py migrate

python manage.py collectstatic --noinput

gunicorn src.wsgi:application --bind 0.0.0:8000 --workers 3 --timeout 120 --log-level info
