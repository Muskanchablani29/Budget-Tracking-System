import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'budget_tracker.settings')
django.setup()

from django.contrib.auth.models import User

# Delete all existing users
User.objects.all().delete()
print("All users deleted!")

# Create new user
username = 'muskan'
password = 'muskan123'

User.objects.create_superuser(username=username, password=password, email='muskan@budget.com')
print(f"New user created successfully!")
print(f"Username: {username}")
print(f"Password: {password}")