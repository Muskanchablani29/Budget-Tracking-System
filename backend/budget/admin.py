from django.contrib import admin
from .models import Category, MonthlyBudget, Expense

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']

@admin.register(MonthlyBudget)
class MonthlyBudgetAdmin(admin.ModelAdmin):
    list_display = ['month', 'amount', 'created_at']

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['description', 'amount', 'category', 'date']
    list_filter = ['category', 'date']