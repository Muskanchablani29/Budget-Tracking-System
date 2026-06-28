from rest_framework import serializers
from .models import Category, MonthlyBudget, Expense, Wallet, Transaction, Person, PersonalTransaction, PersonalRecord

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['balance', 'updated_at']

class MonthlyBudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyBudget
        fields = ['id', 'month', 'amount', 'created_at']

class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)
    
    class Meta:
        model = Expense
        fields = ['id', 'amount', 'description', 'category', 'category_name', 'category_icon', 'category_color', 'date', 'created_at']

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'type', 'amount', 'description', 'date']

class AddMoneySerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0.01)
    description = serializers.CharField(max_length=200, default="Added money")

class PersonSerializer(serializers.ModelSerializer):
    balance = serializers.SerializerMethodField()
    
    class Meta:
        model = Person
        fields = ['id', 'name', 'description', 'relationship', 'phone', 'email', 'balance', 'created_at']
    
    def get_balance(self, obj):
        return float(obj.get_balance())

class PersonalTransactionSerializer(serializers.ModelSerializer):
    person_name = serializers.CharField(source='person.name', read_only=True)
    person_relationship = serializers.CharField(source='person.relationship', read_only=True)
    
    class Meta:
        model = PersonalTransaction
        fields = ['id', 'person', 'person_name', 'person_relationship', 'type', 'amount', 'description', 'date', 'interest_rate', 'due_date', 'is_settled', 'created_at']

class PersonalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalRecord
        fields = ['id', 'type', 'amount', 'description', 'date', 'created_at']