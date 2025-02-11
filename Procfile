web: python manage.py migrate && npm run wp_prod --omit=dev && python manage.py collectstatic --noinput && gunicorn uwb_tracker.wsgi
