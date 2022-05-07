from django.contrib import admin
from core.models import Product


class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'created']
    search_fields = ['name', 'description']
    list_filter = ['created', 'available']


admin.site.register(Product, ProductAdmin)
