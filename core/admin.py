from django.contrib import admin
from core.models import Product, UserMailing, SyncJob


class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'created']
    search_fields = ['name', 'description', 'id']
    list_filter = ['created', 'available', 'is_featured', 'is_liked']

class UserMailingAdmin(admin.ModelAdmin):
    list_display = ['email', 'date_added']
    search_fields = ['email']
    list_filter = ['is_subscribed']
    

class SyncJobAdmin(admin.ModelAdmin):
    list_display = ['status', 'source', 'imported_at']


admin.site.register(SyncJob, SyncJobAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(UserMailing, UserMailingAdmin)
