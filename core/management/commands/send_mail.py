from django.core.mail import EmailMultiAlternatives
from django.core.management.base import BaseCommand
from django.contrib.sites.models import Site
from django.template.loader import render_to_string
from core.models import UserMailing, Product

def fashion_trends_newsletter():
    subcribers = UserMailing.objects.filter(is_subscribed=True)
    emails= []
    for subcriber in subcribers:
        # last 10 products
        products = Product.objects.order_by('-created')[:10]
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
        # print(subcriber)

class Command(BaseCommand):
    def handle(self, *args, **options):
        fashion_trends_newsletter()