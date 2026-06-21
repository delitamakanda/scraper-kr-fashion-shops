import json
import re
from django.views.decorators.csrf import csrf_exempt

from core.serializers import ProductSerializer, SyncJobSerializer
from django.urls import reverse
from core.models import Product, UserMailing
from core.selectors.sync_job_selectors import SyncJobSelector
from core.selectors.weather_selectors import WeatherSelectors
from core.selectors.product_selectors import ProductSelectors

from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views import View


class APIRoot(View):

    @staticmethod
    def get(request):
        data = {
            'products': {
                'count': Product.objects.all().count(),
                'url': reverse('products_api')
            },
            'newsletter': {
                'count': UserMailing.objects.all().count(),
                'url': reverse('create_signup_mail')
            },
            'weather': {
                'url': reverse('weather_api')
            },
            'latest_sync_job': {
                'url': reverse('latest_sync_job_api')
            },
            'latest_sync_job_five_api': {
                'url': reverse('latest_sync_job_five_api')
            },
            'status': {
                'url': reverse('healthcheck:system_status')
            },
            'ping': {
                'url': reverse('healthcheck:ping_status', args=['localhost'])
            },
            'check_alerts': {
                'url': reverse('healthcheck:check_alerts')
            },
            'alerts': {
                'url': reverse('healthcheck:get_all_alerts')
            },
            'metrics': {
                'url': reverse('healthcheck:get_metrics_by_host', args=[1])
            }
        }
        return JsonResponse(data, safe=False)


class SyncJobAPIView(View):
    @staticmethod
    def get(request):
        last_job_sync = SyncJobSelector.get_last_sync_job()
        serializer = SyncJobSerializer.serialize(last_job_sync)
        return JsonResponse(serializer)
    
    
class SyncJobLastFiveAPIView(View):
    @staticmethod
    def get(request):
        last_five_jobs_sync = SyncJobSelector.get_last_five_sync_jobs()
        data = [SyncJobSerializer.serialize(data) for data in last_five_jobs_sync]
        return JsonResponse(data, safe=False)

class WeatherAPIView(View):
    @staticmethod
    def get(request):
        weather_data = WeatherSelectors.get_weather()
        return JsonResponse(weather_data, safe=False)

class ProductListApiView(View):
    @staticmethod
    def get(request):
        # returns all keys of dict
        ps = ProductSelectors.get_all_products(request=request)
        
        # serializer data
        serialized_data = [ProductSerializer.serialize(product) for product in ps["products_page"]]
        request_uri = request.build_absolute_uri().replace('?page=' + str(ps["page"]), '').replace('&q=', '')
        return JsonResponse({
            'count': ps['products_page'].paginator.count,
            'next': request_uri + '?page=' + str(ps["products_page"].next_page_number()) + '&q=' + ps["search_query"] if ps["products_page"].has_next() else None,
            'previous': request_uri + '?page=' + str(ps["products_page"].previous_page_number()) + '&q=' + ps["search_query"] if ps["products_page"].has_previous() else None,
            # the current page number
            'page_number': ps["products_page"].number,
            # the number of products on the current page
            'page_size': ps["products_page"].paginator.per_page,
            'results': serialized_data,
            # the number of total pages
            'total_pages': ps["paginator"].num_pages,
        }, safe=False)


@csrf_exempt
def subscribe(request):
    if request.method == 'POST':
        # get email from json request
        data = request.body.decode('utf-8')
        data_dict = json.loads(data)
        email = data_dict.get('email')
        # validate email format
        if email and not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return JsonResponse({ 'Error': 'Invalid email format.' }, status=400)
        elif not email:
            return JsonResponse({ 'Error': 'Email field is required.' }, status=400)
        try:
            # check if email not already exists in the mailing list
            if email and not UserMailing.objects.filter(email=email).exists():
                UserMailing.objects.create(email=email)
                return JsonResponse({ 'Success': 'Subscribed successfully!' }, status=201)
            return JsonResponse({ 'Error': 'Email already exists in the mailing list.' }, status=400)
        except Exception as e:
            return JsonResponse({ 'Error': "Error subscribing to %s: %s" % (email, e) }, status=400)
    return None


def unsubscribe(request, email=None):
    subscriber = get_object_or_404(UserMailing, email=email)
    try:
        if request.method == 'POST':
            subscriber.is_subscribed = False
            subscriber.save()
            return redirect('/')
    except Exception as e:
        print("Error unsubscribing from %s: %s" % (email, e))
    return render(request, 'unsubscribe.html', { 'email': email })
