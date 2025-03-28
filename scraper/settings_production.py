import dj_database_url
from scraper.settings import *

DATABASES['default'] = dj_database_url.config()
DATABASES['default']['CONN_MAX_AGE'] = 60
DATABASES['default']['ATOMIC_REQUESTS'] = True

DEBUG = os.getenv('DEBUG') == 'True'

SECRET_KEY = os.getenv('SECRET_KEY')

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTOCOL', 'https')
SECURE_HSTS_SECONDS = 60 * 60 * 24 * 7
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_REFERRER_POLICY = 'strict-origin'
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

SECURE_CONTENT_TYPE_NOSNIFF = True

CSRF_TRUSTED_ORIGINS=os.getenv('CSRF_TRUSTED_ORIGINS').split(',')

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS').split(',')

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
EMAIL_SUBJECT_PREFIX = '[KF App] '

STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

# Media storages

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
}

DEFAULT_FILE_STORAGE = 'scraper.storage_backends.MediaStorage'
