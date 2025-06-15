"""scraper URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from django.conf import settings
from django.contrib.staticfiles.views import serve
from django.conf.urls.static import static
from django.views.generic.base import TemplateView

from core.views import (
    APIRoot,
    ProductListApiView,
WeatherAPIView,
    subscribe,
    unsubscribe,
system_status,
health,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('service-worker.js', (TemplateView.as_view(template_name="service-worker.js", content_type='application/javascript', )), name='service-worker.js'),
    path('offline.html', (TemplateView.as_view(template_name="offline.html")), name='offline.html'),
    re_path(r'^static/(?P<path>.*)$', serve, { 'document_root': settings.STATIC_ROOT }),
    path(r'', TemplateView.as_view(template_name='base.html')),
    path('api/', APIRoot.as_view(), name='api_root'),
    path('api/signup/', subscribe, name='create_signup_mail'),
    path('api/products/', ProductListApiView.as_view(), name='products_api'),
    path('unsubscribe/<str:email>/', unsubscribe, name='unsubscribe'),
    path('api/weather/', WeatherAPIView.as_view(), name='weather_api'),
    path('api/status/', system_status, name='system_status'),
    path('api/health/', health, name='health'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
