from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password

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
        ('REFUND', 'Refund'),
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

class Person(models.Model):
    RELATIONSHIP_CHOICES = [
        ('FAMILY', 'Family'),
        ('FRIEND', 'Friend'),
        ('COLLEAGUE', 'Colleague'),
        ('BUSINESS', 'Business'),
        ('OTHER', 'Other'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    relationship = models.CharField(max_length=20, choices=RELATIONSHIP_CHOICES)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} ({self.relationship})"
    
    def get_balance(self):
        lent = PersonalTransaction.objects.filter(person=self, type='LENT').aggregate(models.Sum('amount'))['amount__sum'] or 0
        received = PersonalTransaction.objects.filter(person=self, type='RECEIVED').aggregate(models.Sum('amount'))['amount__sum'] or 0
        borrowed = PersonalTransaction.objects.filter(person=self, type='BORROWED').aggregate(models.Sum('amount'))['amount__sum'] or 0
        paid_back = PersonalTransaction.objects.filter(person=self, type='PAID_BACK').aggregate(models.Sum('amount'))['amount__sum'] or 0
        return (lent - received) - (borrowed - paid_back)
    
    class Meta:
        unique_together = ['user', 'name']
        ordering = ['name']

class PersonalTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('LENT', 'Money Lent'),
        ('BORROWED', 'Money Borrowed'),
        ('RECEIVED', 'Money Received Back'),
        ('PAID_BACK', 'Money Paid Back'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    type = models.CharField(max_length=15, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=200)
    date = models.DateField(default=timezone.now)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0, blank=True, null=True)
    due_date = models.DateField(blank=True, null=True)
    is_settled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.type} - {self.person.name} - ₹{self.amount}"
    
    class Meta:
        ordering = ['-date', '-created_at']

class PersonalRecord(models.Model):
    RECORD_TYPES = [
        ('EXPENSE', 'Personal Expense'),
        ('LOAN', 'Personal Loan'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=10, choices=RECORD_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=200)
    date = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.type} - ₹{self.amount}"
    
    class Meta:
        ordering = ['-date', '-created_at']