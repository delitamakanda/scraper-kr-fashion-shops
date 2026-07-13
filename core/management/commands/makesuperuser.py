from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.utils.crypto import get_random_string


class Command(BaseCommand):
    help = 'Creates a new user'
    def handle(self, *args, **options):
        email = 'admin2@example.com'
        password = get_random_string(length=10)
        try:
            u = None
            if not User.objects.filter(email=email).exists():
                self.stdout.write(self.style.SUCCESS(f'Creating user {email}'))
                u = User.objects.create_superuser(username='admin1', email=email, password=password)
                self.stdout.write('=============')
                self.stdout.write('A user has been created:')
                self.stdout.write(f'Username: {u.username}')
                self.stdout.write(f'Email: {u.email}')
                self.stdout.write(f'Password: {password}')
                self.stdout.write('=============')
                self.stdout.write('Please remember to change the password after logging in.')
            else:
                self.stdout.write(self.style.ERROR('User already exists'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating user: {e}'))
