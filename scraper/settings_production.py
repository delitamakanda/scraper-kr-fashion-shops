import os
from scraper.settings import *
import dj_database_url

DATABASES['default'] = dj_database_url.config()

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

ALLOWED_HOSTS = ['koreanfashion.herokuapp.com', ]

# email admin

SERVER_EMAIL = os.getenv('ADMIN_EMAIL')

ADMINS = [
    (os.getenv('ADMIN_NAME'), os.getenv('ADMIN_EMAIL')),
]

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('SENDGRID_SERVER')
EMAIL_PORT = os.getenv('SENDGRID_PORT')
EMAIL_HOST_USER = os.getenv('SENDGRID_USERNAME')
EMAIL_HOST_PASSWORD = os.getenv('SENDGRID_PASSWORD')
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
EMAIL_TIMEOUT = 500

CSRF_COOKIE_SECURE = True
SECURE_HSTS_PRELOAD = True
SECURE_HSTS_SECONDS = 60 * 60 * 24 * 365
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media storages

AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')
AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
}

DEFAULT_FILE_STORAGE = 'scraper.storage_backends.MediaStorage'
