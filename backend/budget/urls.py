from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .authentication import login_view, logout_view, check_auth

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'budgets', views.MonthlyBudgetViewSet, basename='monthlybudget')
router.register(r'expenses', views.ExpenseViewSet, basename='expense')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/dashboard/', views.dashboard_summary, name='dashboard'),
    path('api/add-money/', views.add_money, name='add_money'),
    path('api/transactions/', views.transactions, name='transactions'),
    path('api/monthly-analytics/', views.monthly_analytics, name='monthly_analytics'),
    path('api/expenses/<int:expense_id>/delete/', views.delete_expense, name='delete_expense'),
    path('api/transactions/<int:transaction_id>/delete/', views.delete_transaction, name='delete_transaction'),
    path('api/spending-insights/', views.spending_insights, name='spending_insights'),
    path('api/monthly-reports/', views.monthly_reports, name='monthly_reports'),
    path('api/download-report/<int:year>/<int:month>/', views.download_monthly_report, name='download_monthly_report'),
    path('api/login/', login_view, name='login'),
    path('api/logout/', logout_view, name='logout'),
    path('api/check-auth/', check_auth, name='check_auth'),
]