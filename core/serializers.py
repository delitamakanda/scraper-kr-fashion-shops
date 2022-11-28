from rest_framework import serializers

from core.models import Product, UserMailing


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
            'source',
            'countProductsByBrand',
        )

class UserMailingSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserMailing
        fields = (
            'id',
            'email',
            'is_subscribed',
            'date_added',
        )