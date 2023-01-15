from .models import Product
from django_filters import FilterSet, NumberFilter, BaseInFilter

class NumberInFilter(NumberFilter):
    pass


class ProductFilter(FilterSet):
    id__in = NumberInFilter(field_name='id', lookup_expr='in')

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'description']
