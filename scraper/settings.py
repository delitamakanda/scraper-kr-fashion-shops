"""
Django settings for scraper project.

Generated by 'django-admin startproject' using Django 4.0.3.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""
import os
from pathlib import Path
import environ

env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False)
)
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

env = environ.Env()
env_file = os.path.join(BASE_DIR, '.env')
if os.path.isfile(env_file):
    env.read_env(env_file)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-360mrn8*oazt-gqdfw7c40u*4a=2++xehekz544%!1ozt2$sbs')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', True)

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["*"])

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    
    'rest_framework',
    'corsheaders',
    'django_filters',
    'fcm_django',

    'core',
]

SITE_ID = 1

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'scraper.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'core.context_processors.settings',
            ],
        },
    },
]

WSGI_APPLICATION = 'scraper.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = '/static/'

VITE_APP_DIR = os.path.join(BASE_DIR, 'src')

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
    os.path.join(VITE_APP_DIR, 'dist'),
]

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

SESSION_EXPIRE_AT_BROWSER_CLOSE = False
SESSION_SAVE_EVERY_REQUEST = True
SESSION_COOKIE_AGE = 1209600  # 2 weeks
SESSION_COOKIE_DOMAIN = None
SESSION_COOKIE_SECURE = False

REST_FRAMEWORK = {
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.NamespaceVersioning',
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'core.pagination.CorePagination',
    'SEARCH_PARAM': 'q',
    'ORDERING_PARAM': 'ordering',
    'DEFAULT_FILTER_BACKENDS': (
        'rest_framework.filters.OrderingFilter',
        'rest_framework.filters.SearchFilter',
        'django_filters.rest_framework.DjangoFilterBackend',
    ),
    'DEFAULT_METADATA_CLASS': 'rest_framework.metadata.SimpleMetadata',
    'TEST_REQUEST_DEFAULT_FORMAT': 'vnd.api+json',
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),
}

FCM_DJANGO_SETTINGS = {
    "ONE_DEVICE_PER_USER": True,
    "DELETE_INACTIVE_DEVICES": False,
    "UPDATE_ON_DUPLICATE_REG_ID": True,
    "FCM_SERVER_KEY": os.getenv("FCM_SERVER_KEY", default="dummy"),
}

import firebase_admin
from firebase_admin import initialize_app, credentials

try:
    cred = credentials.Certificate({
        "type": "service_account",
        "project_id": os.environ.get('FIREBASE_PROJECT_ID'),
        "private_key_id": os.environ.get('PRIVATE_KEY_ID'),
        "private_key": os.environ.get('FIREBASE_PRIVATE_KEY').replace('\\n', '\n'),
        "client_email": os.environ.get('FIREBASE_CLIENT_EMAIL'),
        "client_id": os.environ.get('CLIENT_ID'),
        "auth_uri": os.environ.get('AUTH_URI'),
        "token_uri": os.environ.get('TOKEN_URI'),
        "auth_provider_x509_cert_url": os.environ.get('AUTH_PROVIDER_X509_CERT_URL'),
        "client_x509_cert_url": os.environ.get('CLIENT_X509_CERT_URL'),
    })

    firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"Failed to initialize Firebase: {e}")

# celery
CELERY_BROKER_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.getenv('REDIS_URL', 'redis://localhost:6379/0')

from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    "sample_task": {
        "task": "core.tasks.sample_task",
        "schedule": crontab(minute="*/1"),
    },
    "populate_maybe_baby_products": {
        "task": "core.tasks.populate_maybe_baby_products",
        "schedule": crontab(minute="*/1"),
    },
    "populate_stylenanda_products": {
        "task": "core.tasks.populate_stylenanda_products",
        "schedule": crontab(minute="*/1"),
    },
}

# email
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# cors
CORS_ORIGIN_ALLOW_ALL = False

CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://kf.applikuapp.com',
    'https://fcm.googleapis.com',
]

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "loggers": {"": {"handlers": ["console"], "level": "DEBUG"}},
}
