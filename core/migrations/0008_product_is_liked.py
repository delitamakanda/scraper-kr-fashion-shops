# Generated by Django 4.0.3 on 2023-01-08 16:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_alter_product_is_featured'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='is_liked',
            field=models.BooleanField(default=False),
        ),
    ]