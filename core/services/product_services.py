from core.filters import ProductFilter
from core.models import Product
from logging import getLogger
from django.conf import settings
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q

logger = getLogger(__name__)

class ProductServices:
    @staticmethod
    def get_all_products(request=None, *args, **kwargs) -> dict:
        queryset = Product.objects.all().order_by('-created')
        
        # searching functionality
        search_query = request.GET.get(settings.SEARCH_PARAM, '')
        if search_query:
            queryset = queryset.filter(Q(description__icontains=search_query) | Q(name__icontains=search_query) | Q(
                source__icontains=search_query))
        
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
        return {
            "page": page,
            "products_page": products_page,
            "page_size": page_size,
            "search_query": search_query,
            "paginator": paginator,
        }