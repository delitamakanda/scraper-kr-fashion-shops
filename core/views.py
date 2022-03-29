import django_filters.rest_framework

from rest_framework import generics, permissions, reverse, views, filters, response
from core.serializers import ProductSerializer
from core.models import Product


class APIRoot(views.APIView):

    def get(self, request, format=None):
        data = {
            'products': {
                'count': Product.objects.all().count(),
                'url': reverse.reverse('products_api', request=request)
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
