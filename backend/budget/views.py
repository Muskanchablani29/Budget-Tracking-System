from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from django.db.models import Sum
from django.db import transaction
from datetime import datetime, timedelta
from decimal import Decimal
from calendar import monthrange
from django.contrib.auth.models import User
from .models import Category, MonthlyBudget, Expense, Wallet, Transaction
from .serializers import (CategorySerializer, MonthlyBudgetSerializer, ExpenseSerializer, 
                         WalletSerializer, TransactionSerializer, AddMoneySerializer)

@method_decorator(csrf_exempt, name='dispatch')
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

@method_decorator(csrf_exempt, name='dispatch')
class MonthlyBudgetViewSet(viewsets.ModelViewSet):
    serializer_class = MonthlyBudgetSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # Get muskan user for demo
        admin_user = User.objects.filter(username='muskan').first()
        if admin_user:
            return MonthlyBudget.objects.filter(user=admin_user)
        return MonthlyBudget.objects.none()
    
    def create(self, request, *args, **kwargs):
        admin_user = User.objects.filter(username='muskan').first()
        if not admin_user:
            return Response({'error': 'User not found'}, status=404)
        
        try:
            amount = request.data.get('amount')
            month = request.data.get('month')
            
            if not amount or not month:
                return Response({'error': 'Amount and month are required'}, status=400)
            
            # Parse month string to date
            month_date = datetime.strptime(month + '-01', '%Y-%m-%d').date()
            
            # Create or update budget
            budget, created = MonthlyBudget.objects.update_or_create(
                user=admin_user,
                month=month_date,
                defaults={'amount': amount}
            )
            
            serializer = self.get_serializer(budget)
            return Response(serializer.data, status=201)
            
        except Exception as e:
            return Response({'error': str(e)}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # Get muskan user for demo
        admin_user = User.objects.filter(username='muskan').first()
        if admin_user:
            return Expense.objects.filter(user=admin_user)
        return Expense.objects.none()
    
    def perform_create(self, serializer):
        # Get muskan user for demo
        admin_user = User.objects.filter(username='muskan').first()
        if admin_user:
            with transaction.atomic():
                expense = serializer.save(user=admin_user)
                
                # Update wallet balance
                wallet, created = Wallet.objects.get_or_create(user=admin_user)
                wallet.balance = max(0, wallet.balance - expense.amount)
                wallet.save()
                
                # Create transaction record
                Transaction.objects.create(
                    user=admin_user,
                    type='EXPENSE',
                    amount=expense.amount,
                    description=f"Expense: {expense.description}"
                )

@api_view(['GET'])
@permission_classes([AllowAny])
@csrf_exempt
def dashboard_summary(request):
    current_month = datetime.now().replace(day=1).date()
    admin_user = User.objects.filter(username='muskan').first()
    if not admin_user:
        return Response({'error': 'Muskan user not found'}, status=404)
    
    # Get or create wallet
    wallet, created = Wallet.objects.get_or_create(user=admin_user)
    
    # Get current month budget
    try:
        budget = MonthlyBudget.objects.get(user=admin_user, month=current_month)
        budget_amount = float(budget.amount)
    except MonthlyBudget.DoesNotExist:
        budget_amount = 0
    
    # Get current month expenses
    expenses = Expense.objects.filter(
        user=admin_user,
        date__year=current_month.year,
        date__month=current_month.month
    )
    
    total_spent = expenses.aggregate(Sum('amount'))['amount__sum'] or 0
    remaining_budget = max(0, budget_amount - float(total_spent)) if budget_amount > 0 else 0
    
    # Calculate daily average and projections
    days_in_month = (datetime.now().replace(month=datetime.now().month % 12 + 1, day=1) - timedelta(days=1)).day
    current_day = datetime.now().day
    daily_avg = float(total_spent) / current_day if current_day > 0 else 0
    projected_monthly = daily_avg * days_in_month
    
    # Get last 7 days expenses
    last_week = datetime.now().date() - timedelta(days=7)
    week_expenses = Expense.objects.filter(user=admin_user, date__gte=last_week)
    week_spent = week_expenses.aggregate(Sum('amount'))['amount__sum'] or 0
    
    # Category breakdown with percentages
    category_breakdown = expenses.values('category__name', 'category__icon', 'category__color').annotate(
        total=Sum('amount')
    ).order_by('-total')[:5]
    
    # Add percentage to categories
    for cat in category_breakdown:
        cat['percentage'] = (float(cat['total']) / float(total_spent) * 100) if total_spent > 0 else 0
    
    # Budget health status
    if budget_amount > 0:
        spent_percentage = (float(total_spent) / budget_amount) * 100
        if spent_percentage <= 50:
            budget_status = 'healthy'
        elif spent_percentage <= 80:
            budget_status = 'warning'
        else:
            budget_status = 'danger'
    else:
        budget_status = 'no_budget'
    
    return Response({
        'wallet_balance': float(wallet.balance),
        'budget': budget_amount,
        'spent': float(total_spent),
        'remaining_budget': remaining_budget,
        'expenses_count': expenses.count(),
        'week_spent': float(week_spent),
        'daily_average': daily_avg,
        'projected_monthly': projected_monthly,
        'budget_status': budget_status,
        'spent_percentage': (float(total_spent) / budget_amount * 100) if budget_amount > 0 else 0,
        'category_breakdown': list(category_breakdown)
    })

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def add_money(request):
    try:
        amount = Decimal(str(request.data.get('amount', 0)))
        description = request.data.get('description', 'Added money')
        
        if amount <= 0:
            return Response({'error': 'Amount must be positive'}, status=400)
        
        # Get muskan user for demo
        admin_user = User.objects.filter(username='muskan').first()
        if not admin_user:
            return Response({'error': 'Muskan user not found'}, status=404)
        
        with transaction.atomic():
            # Update wallet
            wallet, created = Wallet.objects.get_or_create(user=admin_user)
            wallet.balance += amount
            wallet.save()
            
            # Create transaction record
            Transaction.objects.create(
                user=admin_user,
                type='ADD',
                amount=amount,
                description=description
            )
        
        return Response({
            'success': True, 
            'new_balance': float(wallet.balance),
            'message': 'Funds added successfully'
        })
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
@csrf_exempt
def transactions(request):
    admin_user = User.objects.filter(username='muskan').first()
    if admin_user:
        user_transactions = Transaction.objects.filter(user=admin_user).order_by('-date')[:20]
        serializer = TransactionSerializer(user_transactions, many=True)
        return Response(serializer.data)
    return Response([])



@api_view(['GET'])
@permission_classes([AllowAny])
@csrf_exempt
def monthly_analytics(request):
    """Get detailed monthly spending analytics"""
    admin_user = User.objects.filter(username='muskan').first()
    if not admin_user:
        return Response({'error': 'User not found'}, status=404)
    
    # Get last 6 months data
    months_data = []
    for i in range(6):
        target_date = datetime.now().replace(day=1) - timedelta(days=i*30)
        target_month = target_date.replace(day=1).date()
        
        expenses = Expense.objects.filter(
            user=admin_user,
            date__year=target_month.year,
            date__month=target_month.month
        )
        
        try:
            budget = MonthlyBudget.objects.get(user=admin_user, month=target_month)
            budget_amount = float(budget.amount)
        except MonthlyBudget.DoesNotExist:
            budget_amount = 0
        
        total_spent = expenses.aggregate(Sum('amount'))['amount__sum'] or 0
        
        months_data.append({
            'month': target_month.strftime('%Y-%m'),
            'month_name': target_date.strftime('%B %Y'),
            'budget': budget_amount,
            'spent': float(total_spent),
            'remaining': max(0, budget_amount - float(total_spent)),
            'expenses_count': expenses.count()
        })
    
    return Response(months_data)

@api_view(['DELETE'])
@permission_classes([AllowAny])
@csrf_exempt
def delete_expense(request, expense_id):
    """Delete an expense and update wallet balance"""
    admin_user = User.objects.filter(username='muskan').first()
    if not admin_user:
        return Response({'error': 'User not found'}, status=404)
    
    try:
        expense = Expense.objects.get(id=expense_id, user=admin_user)
        
        with transaction.atomic():
            # Refund to wallet
            wallet, created = Wallet.objects.get_or_create(user=admin_user)
            wallet.balance += expense.amount
            wallet.save()
            
            # Create refund transaction
            Transaction.objects.create(
                user=admin_user,
                type='ADD',
                amount=expense.amount,
                description=f"Refund: {expense.description}"
            )
            
            expense.delete()
        
        return Response({'success': True, 'message': 'Expense deleted and refunded'})
    except Expense.DoesNotExist:
        return Response({'error': 'Expense not found'}, status=404)

@api_view(['DELETE'])
@permission_classes([AllowAny])
@csrf_exempt
def delete_transaction(request, transaction_id):
    admin_user = User.objects.filter(username='muskan').first()
    if not admin_user:
        return Response({'error': 'User not found'}, status=404)
    
    try:
        trans = Transaction.objects.get(id=transaction_id, user=admin_user)
        
        with transaction.atomic():
            wallet, created = Wallet.objects.get_or_create(user=admin_user)
            
            # Reverse the transaction effect on wallet
            if trans.type == 'ADD':
                wallet.balance = max(0, wallet.balance - trans.amount)
            else:  # EXPENSE
                wallet.balance += trans.amount
            
            wallet.save()
            trans.delete()
        
        return Response({'success': True, 'message': 'Transaction deleted successfully'})
    except Transaction.DoesNotExist:
        return Response({'error': 'Transaction not found'}, status=404)

@api_view(['GET'])
@permission_classes([AllowAny])
@csrf_exempt
def monthly_reports(request):
    """Get monthly transaction reports"""
    admin_user = User.objects.filter(username='muskan').first()
    if not admin_user:
        return Response({'error': 'User not found'}, status=404)
    
    # Get last 12 months data
    reports = []
    for i in range(12):
        target_date = datetime.now().replace(day=1) - timedelta(days=i*30)
        month_start = target_date.replace(day=1).date()
        
        # Get month transactions
        month_transactions = Transaction.objects.filter(
            user=admin_user,
            date__year=month_start.year,
            date__month=month_start.month
        )
        
        # Calculate totals
        income = month_transactions.filter(type='ADD').aggregate(Sum('amount'))['amount__sum'] or 0
        
        # Get actual expenses (not deleted ones) from Expense model
        month_expenses = Expense.objects.filter(
            user=admin_user,
            date__year=month_start.year,
            date__month=month_start.month
        )
        expenses = month_expenses.aggregate(Sum('amount'))['amount__sum'] or 0
        
        # Get budget
        try:
            budget = MonthlyBudget.objects.get(user=admin_user, month=month_start)
            budget_amount = float(budget.amount)
        except MonthlyBudget.DoesNotExist:
            budget_amount = 0
        
        reports.append({
            'month': month_start.strftime('%Y-%m'),
            'month_name': target_date.strftime('%B %Y'),
            'income': float(income),
            'expenses': float(expenses),
            'net_savings': float(income) - float(expenses),
            'budget': budget_amount,
            'transactions_count': month_transactions.count(),
            'income_transactions': month_transactions.filter(type='ADD').count(),
            'expense_transactions': month_transactions.filter(type='EXPENSE').count()
        })
    
    return Response(reports)

@api_view(['GET'])
@permission_classes([AllowAny])
@csrf_exempt
def download_monthly_report(request, year, month):
    """Download detailed monthly report with all transactions"""
    admin_user = User.objects.filter(username='muskan').first()
    if not admin_user:
        return Response({'error': 'User not found'}, status=404)
    
    try:
        # Parse year and month
        year = int(year)
        month = int(month)
        
        # Get month start and end dates
        month_start = datetime(year, month, 1).date()
        days_in_month = monthrange(year, month)[1]
        month_end = datetime(year, month, days_in_month).date()
        
        # Get all transactions for the month
        transactions = Transaction.objects.filter(
            user=admin_user,
            date__gte=month_start,
            date__lte=month_end
        ).order_by('date')
        
        # Get expenses with category details
        expenses = Expense.objects.filter(
            user=admin_user,
            date__gte=month_start,
            date__lte=month_end
        ).select_related('category').order_by('date')
        
        # Calculate totals
        income_total = transactions.filter(type='ADD').aggregate(Sum('amount'))['amount__sum'] or 0
        expense_total = transactions.filter(type='EXPENSE').aggregate(Sum('amount'))['amount__sum'] or 0
        
        # Get budget
        try:
            budget = MonthlyBudget.objects.get(user=admin_user, month=month_start)
            budget_amount = float(budget.amount)
        except MonthlyBudget.DoesNotExist:
            budget_amount = 0
        
        # Prepare detailed transactions
        detailed_transactions = []
        for trans in transactions:
            detailed_transactions.append({
                'date': trans.date.strftime('%Y-%m-%d'),
                'type': trans.type,
                'amount': float(trans.amount),
                'description': trans.description
            })
        
        # Prepare detailed expenses
        detailed_expenses = []
        for exp in expenses:
            detailed_expenses.append({
                'date': exp.date.strftime('%Y-%m-%d'),
                'amount': float(exp.amount),
                'description': exp.description,
                'category': exp.category.name if exp.category else 'Uncategorized'
            })
        
        report_data = {
            'month': month_start.strftime('%B %Y'),
            'period': f"{month_start.strftime('%Y-%m-%d')} to {month_end.strftime('%Y-%m-%d')}",
            'summary': {
                'total_income': float(income_total),
                'total_expenses': float(expense_total),
                'net_savings': float(income_total) - float(expense_total),
                'budget': budget_amount,
                'budget_remaining': budget_amount - float(expense_total) if budget_amount > 0 else 0
            },
            'transactions': detailed_transactions,
            'expenses': detailed_expenses,
            'transaction_count': transactions.count(),
            'expense_count': expenses.count()
        }
        
        return Response(report_data)
        
    except ValueError:
        return Response({'error': 'Invalid year or month'}, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
@csrf_exempt
def spending_insights(request):
    """Get AI-like spending insights and recommendations"""
    admin_user = User.objects.filter(username='muskan').first()
    if not admin_user:
        return Response({'error': 'User not found'}, status=404)
    
    current_month = datetime.now().replace(day=1).date()
    last_month = (current_month - timedelta(days=1)).replace(day=1)
    
    # Current month data
    current_expenses = Expense.objects.filter(
        user=admin_user,
        date__year=current_month.year,
        date__month=current_month.month
    )
    current_spent = current_expenses.aggregate(Sum('amount'))['amount__sum'] or 0
    
    # Last month data
    last_expenses = Expense.objects.filter(
        user=admin_user,
        date__year=last_month.year,
        date__month=last_month.month
    )
    last_spent = last_expenses.aggregate(Sum('amount'))['amount__sum'] or 0
    
    # Calculate trends
    spending_trend = 'increased' if current_spent > last_spent else 'decreased'
    trend_percentage = abs((float(current_spent) - float(last_spent)) / float(last_spent) * 100) if last_spent > 0 else 0
    
    # Top spending category
    top_category = current_expenses.values('category__name').annotate(
        total=Sum('amount')
    ).order_by('-total').first()
    
    # Generate insights
    insights = []
    if current_spent > last_spent:
        insights.append(f"Your spending has increased by {trend_percentage:.1f}% this month")
    else:
        insights.append(f"Great! You've reduced spending by {trend_percentage:.1f}% this month")
    
    if top_category:
        insights.append(f"Your highest spending category is {top_category['category__name']}")
    
    # Budget recommendations
    try:
        budget = MonthlyBudget.objects.get(user=admin_user, month=current_month)
        if current_spent > budget.amount * 0.8:
            insights.append("You're close to your budget limit. Consider reducing discretionary spending.")
    except MonthlyBudget.DoesNotExist:
        insights.append("Set a monthly budget to better track your spending goals.")
    
    return Response({
        'spending_trend': spending_trend,
        'trend_percentage': trend_percentage,
        'top_category': top_category['category__name'] if top_category else None,
        'insights': insights,
        'current_month_spent': float(current_spent),
        'last_month_spent': float(last_spent)
    })