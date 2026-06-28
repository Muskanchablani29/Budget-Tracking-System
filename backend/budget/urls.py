from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .authentication import login_view, logout_view, check_auth

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'budgets', views.MonthlyBudgetViewSet, basename='monthlybudget')
router.register(r'expenses', views.ExpenseViewSet, basename='expense')
router.register(r'people', views.PersonViewSet, basename='person')
router.register(r'personal-transactions', views.PersonalTransactionViewSet, basename='personal_transaction')

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
    # Personal Money Management URLs
    path('api/personal/dashboard/', views.personal_dashboard, name='personal_dashboard'),
    path('api/personal/person/<int:person_id>/', views.person_details, name='person_details'),
    path('api/personal/person/<int:person_id>/settle/', views.settle_person, name='settle_person'),
    path('api/personal/reports/', views.personal_reports, name='personal_reports'),
    # Personal Diary URLs
    path('api/personal/verify-password/', views.verify_personal_password, name='verify_personal_password'),
    path('api/personal/records/', views.personal_records, name='personal_records'),
]