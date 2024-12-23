from rest_framework.pagination import PageNumberPagination


class CorePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_number'
    max_page_size = 20
