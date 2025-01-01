import json
import re

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.views.decorators.csrf import csrf_exempt

from core.serializers import ProductSerializer, UserMailingSerializer
from django.urls import reverse
from core.models import Product, UserMailing

from django.shortcuts import render, get_object_or_404, redirect
from .filters import ProductFilter
from django.http import JsonResponse
from django.views import View
from django.db.models import Q
from django.conf import settings


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
            }
        }
        return JsonResponse(data, safe=False)


class ProductListApiView(View):
    @staticmethod
    def get(request):
        queryset = Product.objects.all().order_by('-created')
        
        # searching functionality
        search_query = request.GET.get(settings.SEARCH_PARAM, '')
        if search_query:
            queryset = queryset.filter(Q(description__icontains=search_query) | Q(name__icontains=search_query) | Q(source__icontains=search_query))
            
        # ordering functionality
        ordering_field = request.GET.get(settings.ORDERING_PARAM, '-created')
        if ordering_field:
            queryset = queryset.order_by(ordering_field)
        # filtering functionality
        filtering = ProductFilter(request.GET, queryset=queryset)
        queryset = filtering.qs
        
        # pagination functionality
        page_size = request.GET.get('page_size', 10)
        page = request.GET.get('page', 1)
        paginator = Paginator(queryset, page_size)
        try:
            products_page = paginator.page(page)
        except PageNotAnInteger:
            products_page = paginator.page(1)
        except EmptyPage:
            products_page = paginator.page(paginator.num_pages)
        
        # serializer data
        serialized_data = [ProductSerializer.serialize(product) for product in products_page]
        request_uri = request.build_absolute_uri().replace('?page=' + str(page), '')
        return JsonResponse({
            'count': products_page.paginator.count,
            'next': request_uri + '&page=' + str(products_page.next_page_number()) if products_page.has_next() else None,
            'previous': request_uri + '&page=' + str(products_page.previous_page_number()) if products_page.has_previous() else None,
            # the current page number
            'page_number': products_page.number,
            # the number of products on the current page
            'page_size': products_page.paginator.per_page,
            'results': serialized_data,
            # the number of total pages
            'total_pages': paginator.num_pages,
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