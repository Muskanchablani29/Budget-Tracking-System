from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    icon = models.CharField(max_length=20, default='💰')
    color = models.CharField(max_length=7, default='#3498db')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - ${self.balance}"

class MonthlyBudget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    month = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'month']

    def __str__(self):
        return f"{self.user.username} - {self.month.strftime('%B %Y')} - ${self.amount}"

class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.description} - ${self.amount}"

    class Meta:
        ordering = ['-date', '-created_at']

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('ADD', 'Add Money'),
        ('EXPENSE', 'Expense'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=200)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.type} - ${self.amount}"

    class Meta:
        ordering = ['-date']