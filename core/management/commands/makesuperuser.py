from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.utils.crypto import get_random_string



class Command(BaseCommand):
    help = 'Creates a new user'
    def handle(self, *args, **options):
        email = 'admin@example.com'
        password = get_random_string(length=10)
        try:
            u = None
            if not User.objects.filter(email=email).exists():
                self.stdout.write(self.style.SUCCESS('Creating user %s' % email))
                u = User.objects.create_superuser(username='admin', email=email, password=password)
                self.stdout.write('=============')
                self.stdout.write('A user has been created:')
                self.stdout.write('Username: %s' % u.username)
                self.stdout.write('Email: %s' % u.email)
                self.stdout.write('Password: %s' % password)
                self.stdout.write('=============')
                self.stdout.write('Please remember to change the password after logging in.')
            else:
                self.stdout.write(self.style.ERROR('User already exists'))
        except Exception as e:
            self.stdout.write(self.style.ERROR('Error creating user: %s' % e))