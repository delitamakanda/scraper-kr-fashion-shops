from .models import Product
from django_filters import rest_framework as filters

class NumberInFilter(filters.BaseInFilter):
    pass


class ProductFilter(filters.FilterSet):
    id__in = NumberInFilter(field_name='id', lookup_expr='in')

    class Meta:
        model = Product
        fields = ['id']
