# Generated by Django 4.0.3 on 2022-07-12 18:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_usermailing'),
    ]

    operations = [
        migrations.AddField(
            model_name='usermailing',
            name='is_subscribed',
            field=models.BooleanField(default=True),
        ),
    ]