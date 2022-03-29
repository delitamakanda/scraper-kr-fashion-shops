from rest_framework import serializers

from core.models import Product


class ProductSerializer(serializers.ModelSerializer):

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
        )
