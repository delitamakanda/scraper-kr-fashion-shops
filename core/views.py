import django_filters.rest_framework

from rest_framework import generics, permissions, reverse, views, filters, response
from core.serializers import ProductSerializer, UserMailingSerializer
from core.models import Product, UserMailing

from django.shortcuts import render, get_object_or_404, redirect


class APIRoot(views.APIView):

    def get(self, request, format=None):
        data = {
            'products': {
                'count': Product.objects.all().count(),
                'url': reverse.reverse('products_api', request=request)
            },
            'newsletter': {
                'count': UserMailing.objects.all().count(),
                'url': reverse.reverse('create_signup_mail', request=request)
            }
        }
        return response.Response(data)


class ProductListApiView(generics.ListAPIView):
    queryset = Product.objects.all().order_by('-created')
    serializer_class = ProductSerializer
    search_fields = ['description', 'name']
    ordering_fields = ['id', 'name']
    filter_backends = [filters.SearchFilter,
                       filters.OrderingFilter, django_filters.rest_framework.DjangoFilterBackend]
    permission_classes = (permissions.AllowAny,)


class ProductDetailAPIView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (permissions.AllowAny,)


class UserMailingCreateAPIView(generics.CreateAPIView):
    queryset = UserMailing.objects.all()
    serializer_class = UserMailingSerializer
    permission_classes = (permissions.AllowAny,)


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