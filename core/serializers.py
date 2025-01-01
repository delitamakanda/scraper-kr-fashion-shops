from django.forms.models import model_to_dict

class ProductSerializer:
    @staticmethod
    def serialize(instance):
        data = model_to_dict(instance, fields=[
            'id',
            'name',
            'description',
            'price',
            'created',
            'updated',
            'stock',
            'available',
            'image_url',
            'external_link',
            'source',
            'count_products_by_brand',
            'is_liked',
        ])
        if instance.image:
            data['image'] = instance.image.url
        else:
            data['image'] = ''
        if instance.next_item:
            data['next_item'] = {'id': instance.next_item.id, 'name': instance.next_item.name }
        else:
            data['next_item'] = None
            
        if instance.previous_item:
            data['previous_item'] = {'id': instance.previous_item.id, 'name': instance.previous_item.name }
        else:
            data['previous_item'] = None
            
        return data

class UserMailingSerializer:
    @staticmethod
    def serialize(instance):
        return model_to_dict(instance, fields=['id', 'email', 'is_subscribed', 'date_added']  )