import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'budget_tracker.settings')
django.setup()

from django.contrib.auth.models import User

# Create user with fixed credentials
username = 'muskan'
password = 'muskan123'

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, password=password, email='admin@budget.com')
    print(f"User created successfully!")
    print(f"Username: {username}")
    print(f"Password: {password}")
else:
    print("User already exists!")
    print(f"Username: {username}")
    print(f"Password: {password}")