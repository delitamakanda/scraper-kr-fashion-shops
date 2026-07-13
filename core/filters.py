from django_filters import BaseInFilter, FilterSet

from .models import Product


class NumberInFilter(BaseInFilter):
    pass


class ProductFilter(FilterSet):
    id__in = NumberInFilter(field_name="id", lookup_expr="in")

    class Meta:
        model = Product
        fields = ["id"]
