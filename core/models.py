from django.db import models
from django.template.defaultfilters import slugify
from django.http import JsonResponse

class Product(models.Model):
    name = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(max_length=200, db_index=True)
    image = models.ImageField(upload_to='products/%Y/%m/%d', blank=True)
    image_url = models.CharField(default='', max_length=280)
    external_link = models.CharField(default='', max_length=280)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    stock = models.PositiveIntegerField(default=1)
    source = models.CharField(max_length=200, default='')
    is_featured = models.BooleanField(default=False)
    is_liked = models.BooleanField(default=False)

    class Meta:
        ordering = ('name',)
        index_together = (('id', 'slug'),)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super(Product, self).save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def countProductsByBrand(self):
        if (self.source != ''):
            return Product.objects.filter(source=self.source).count()
        return 0

    @property
    def next_item(self):
        next_obj = Product.objects.filter(id__gt=self.id).order_by('id').first()
        if next_obj:
            return next_obj

    @property
    def previous_item(self):
        previous_obj = Product.objects.filter(id__lt=self.id).order_by('-id').first()
        if previous_obj:
            return previous_obj


class UserMailing(models.Model):
    email = models.EmailField(max_length=255, unique=True)
    is_subscribed = models.BooleanField(default=True)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email
