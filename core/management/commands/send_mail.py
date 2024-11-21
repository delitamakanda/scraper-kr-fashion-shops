from django.core.mail import EmailMultiAlternatives
from django.core.management.base import BaseCommand
from django.contrib.sites.models import Site
from django.template.loader import render_to_string
from core.models import UserMailing, Product

def fashion_trends_newsletter(products):
    subcribers = UserMailing.objects.filter(is_subscribed=True)
    emails= []
    for subcriber in subcribers:
        # last 10 products
        products = products
        data = {
            'products': products,
            'subcriber': subcriber,
            'domain': Site.objects.get_current().domain,
        }
        html_body = render_to_string('mailing.html', data)
        message = EmailMultiAlternatives(
            subject='Latest Korean fashion trends - Koreanfashion',
            body='',
            from_email='no-reply@koreanfashion.com',
            to=[subcriber],
        )
        message.attach_alternative(html_body, 'text/html')
        message.send(fail_silently=False)
        queryset = products
        bulk = []
        for product in products:
            product.is_featured = False
            bulk.append(product)
        Product.objects.bulk_update(bulk,['is_featured'])
        # print(subcriber)

class Command(BaseCommand):
    def handle(self, *args, **options):
        products = Product.objects.filter(is_featured=True).order_by('-created')[:10]
        if products.count() > 0:
            fashion_trends_newsletter(products)
            print('Fashion trends newsletter sent')
        else:
            print("No products found")
