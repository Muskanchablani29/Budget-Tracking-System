from django.contrib import admin
from .models import Category, MonthlyBudget, Expense, Wallet, Transaction, Person, PersonalTransaction

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'color']
    list_filter = ['name']
    search_fields = ['name']

@admin.register(MonthlyBudget)
class MonthlyBudgetAdmin(admin.ModelAdmin):
    list_display = ['user', 'month', 'amount']
    list_filter = ['month', 'user']
    search_fields = ['user__username']

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['user', 'description', 'amount', 'category', 'date']
    list_filter = ['category', 'date', 'user']
    search_fields = ['description', 'user__username']
    date_hierarchy = 'date'

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ['user', 'balance']
    list_filter = ['user']
    search_fields = ['user__username']
    readonly_fields = ['balance']

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'type', 'amount', 'description', 'date']
    list_filter = ['type', 'date', 'user']
    search_fields = ['description', 'user__username']
    date_hierarchy = 'date'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'relationship', 'phone', 'email', 'get_balance']
    list_filter = ['relationship', 'user']
    search_fields = ['name', 'user__username', 'phone', 'email']
    
    def get_balance(self, obj):
        return f"₹{obj.get_balance():.2f}"
    get_balance.short_description = 'Balance'
    get_balance.admin_order_field = 'name'

@admin.register(PersonalTransaction)
class PersonalTransactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'person', 'type', 'amount', 'description', 'date', 'is_settled']
    list_filter = ['type', 'date', 'is_settled', 'user', 'person__relationship']
    search_fields = ['description', 'user__username', 'person__name']
    date_hierarchy = 'date'
    list_editable = ['is_settled']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'person')