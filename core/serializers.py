from rest_framework import serializers
from rest_framework.response import Response

from core.models import Product, UserMailing


class ProductSerializer(serializers.ModelSerializer):
    next_item = serializers.SerializerMethodField()
    previous_item = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            'id',
            'name',
            'image',
            'description',
            'price',
            'created',
            'updated',
            'stock',
            'available',
            'image_url',
            'external_link',
            'source',
            'countProductsByBrand',
            'next_item',
            'previous_item',
        )
        read_only_fields = (
            'id',
            'name',
        )
        extra_kwargs = {
            'id': {'required': False},
        }
        extra_kwargs_update = {
            'id': {'required': False},
        }

    def get_next_item(self, obj):
        if obj.next_item:
            return Response({'id': obj.next_item.id, 'name': obj.next_item.name}).data

    def get_previous_item(self, obj):
        if obj.previous_item:
            return Response({'id': obj.previous_item.id, 'name': obj.previous_item.name}).data

class UserMailingSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserMailing
        fields = (
            'id',
            'email',
            'is_subscribed',
            'date_added',
        )