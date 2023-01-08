from django.contrib import admin
from core.models import Product, UserMailing


class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'created']
    search_fields = ['name', 'description']
    list_filter = ['created', 'available', 'is_featured', 'is_liked']

class UserMailingAdmin(admin.ModelAdmin):
    list_display = ['email', 'date_added']
    search_fields = ['email']
    list_filter = ['is_subscribed']


admin.site.register(Product, ProductAdmin)
admin.site.register(UserMailing, UserMailingAdmin)
