import React, { useState, useEffect } from 'react';
import './App.css';
import './reports.css';
import './modern-categories.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [dashboard, setDashboard] = useState({ 
    wallet_balance: 0, budget: 0, spent: 0, remaining_budget: 0, 
    week_spent: 0, category_breakdown: [] 
  });
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showSetBudget, setShowSetBudget] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reports, setReports] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [newExpense, setNewExpense] = useState({ 
    amount: '', description: '', category: '', 
    date: new Date().toISOString().split('T')[0] 
  });
  const [newMoney, setNewMoney] = useState({ amount: '', description: 'Added money' });
  const [newBudget, setNewBudget] = useState({ 
    amount: '', 
    month: new Date().toISOString().slice(0, 7) 
  });

  const API_BASE = 'http://localhost:8000/api';

  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      checkAuth();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAll();
    }
  }, [isAuthenticated]);

  const fetchAll = async () => {
    await Promise.all([
      fetchDashboard(),
      fetchExpenses(),
      fetchCategories(),
      fetchTransactions(),
      fetchReports()
    ]);
  };

  const fetchReports = async () => {
    try {
      const response = await fetch(`${API_BASE}/monthly-reports/`, { 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReports(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports([]);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE}/check-auth/`, { 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
      localStorage.setItem('isAuthenticated', data.authenticated.toString());
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      localStorage.setItem('isAuthenticated', 'false');
    } finally {
      setLoading(false);
    }
  };

  const login = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', loginData);
    try {
      const response = await fetch(`${API_BASE}/login/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(loginData)
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        setLoginData({ username: '', password: '' });
      } else {
        alert(`Login failed: ${data.message || 'Invalid credentials'}`);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login error - check console');
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/logout/`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsAuthenticated(false);
      localStorage.setItem('isAuthenticated', 'false');
      setActiveTab('dashboard');
    }
  };

  const fetchDashboard = async () => {
    try {
      const response = await fetch(`${API_BASE}/dashboard/`, { 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDashboard(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_BASE}/expenses/`, { 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) { 
        const data = await response.json();
        setExpenses(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setExpenses([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/categories/`, { 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_BASE}/transactions/`, { 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/expenses/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: parseFloat(newExpense.amount),
          description: newExpense.description,
          category: parseInt(newExpense.category),
          date: newExpense.date
        })
      });
      
      if (response.ok) {
        setNewExpense({ amount: '', description: '', category: '', date: new Date().toISOString().split('T')[0] });
        setShowAddExpense(false);
        await fetchAll();
        alert('Expense added successfully!');
      } else {
        alert('Failed to add expense. Please try again.');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Error adding expense. Please try again.');
    }
  };

  const addMoney = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/add-money/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: parseFloat(newMoney.amount),
          description: newMoney.description
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setNewMoney({ amount: '', description: 'Added money' });
        setShowAddMoney(false);
        await fetchAll();
        alert(`Funds added successfully! New balance: ₹${data.new_balance?.toFixed(2)}`);
      } else {
        alert('Failed to add funds. Please try again.');
      }
    } catch (error) {
      console.error('Error adding money:', error);
      alert('Error adding funds. Please try again.');
    }
  };

  const setBudget = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/budgets/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: parseFloat(newBudget.amount),
          month: newBudget.month
        })
      });
      
      if (response.ok) {
        setNewBudget({ amount: '', month: new Date().toISOString().slice(0, 7) });
        setShowSetBudget(false);
        await fetchDashboard();
        alert('Budget set successfully!');
      } else {
        alert('Failed to set budget. Please try again.');
      }
    } catch (error) {
      console.error('Error setting budget:', error);
      alert('Error setting budget. Please try again.');
    }
  };

  const deleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/expenses/${expenseId}/delete/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        await fetchAll();
        alert('Expense deleted and refunded successfully!');
      } else {
        alert('Failed to delete expense.');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Error deleting expense.');
    }
  };

  const deleteTransaction = async (transactionId) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/transactions/${transactionId}/delete/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        await fetchAll();
        alert('Transaction deleted successfully!');
      } else {
        alert('Failed to delete transaction.');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Error deleting transaction.');
    }
  };

  const calculateProgress = () => {
    if (dashboard.budget === 0 || dashboard.budget === null) return 0;
    return Math.min((dashboard.spent / dashboard.budget) * 100, 100);
  };

  const downloadReport = async (monthStr) => {
    try {
      const [year, month] = monthStr.split('-');
      const response = await fetch(`${API_BASE}/download-report/${year}/${month}/`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Generate CSV content
        let csvContent = `Monthly Report - ${data.month}\n`;
        csvContent += `Period: ${data.period}\n\n`;
        csvContent += `SUMMARY\n`;
        csvContent += `Total Income,₹${data.summary.total_income.toFixed(2)}\n`;
        csvContent += `Total Expenses,₹${data.summary.total_expenses.toFixed(2)}\n`;
        csvContent += `Net Savings,₹${data.summary.net_savings.toFixed(2)}\n`;
        csvContent += `Budget,₹${data.summary.budget.toFixed(2)}\n`;
        csvContent += `Budget Remaining,₹${data.summary.budget_remaining.toFixed(2)}\n\n`;
        
        csvContent += `ALL TRANSACTIONS\n`;
        csvContent += `Date,Type,Amount,Description\n`;
        data.transactions.forEach(trans => {
          csvContent += `${trans.date},${trans.type},₹${trans.amount.toFixed(2)},"${trans.description}"\n`;
        });
        
        csvContent += `\nDETAILED EXPENSES\n`;
        csvContent += `Date,Amount,Description,Category\n`;
        data.expenses.forEach(exp => {
          csvContent += `${exp.date},₹${exp.amount.toFixed(2)},"${exp.description}",${exp.category}\n`;
        });
        
        // Download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Monthly_Report_${data.month.replace(' ', '_')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        alert('Report downloaded successfully!');
      } else {
        alert('Failed to download report.');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Error downloading report.');
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="app">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h2>💰 BudgetPro</h2>
              <p>Your smart financial companion</p>
            </div>
            <form className="login-form" onSubmit={login}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="login-btn">Sign In</button>
            </form>
            <div className="login-footer">
              <p>Demo: muskan / muskan123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>💰 BudgetPro</h1>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={activeTab === 'dashboard' ? 'nav-item active' : 'nav-item'} 
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>
          <button 
            className={activeTab === 'expenses' ? 'nav-item active' : 'nav-item'} 
            onClick={() => setActiveTab('expenses')}
          >
            <span className="nav-icon">💸</span>
            <span className="nav-text">Expenses</span>
          </button>
          <button 
            className={activeTab === 'transactions' ? 'nav-item active' : 'nav-item'} 
            onClick={() => setActiveTab('transactions')}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-text">History</span>
          </button>
          <button 
            className={activeTab === 'reports' ? 'nav-item active' : 'nav-item'} 
            onClick={() => setActiveTab('reports')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Reports</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>Sign Out</button>
        </div>
      </div>

      <div className="main-wrapper">
        <header className="header">
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
        </header>
        <main className="main-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-tab">
            <div className="dashboard-left">
              {/* Hero Card */}
              <div className="hero-card">
                <div className="hero-content">
                  <div className="hero-title">Total Balance</div>
                  <div className="hero-balance">₹{dashboard.wallet_balance?.toFixed(2) || '0.00'}</div>
                  <div className="hero-subtitle">Available for spending</div>
                  <div className="hero-actions">
                    <button className="hero-btn primary" onClick={() => setShowAddMoney(true)}>
                      Add Funds
                    </button>
                    <button className="hero-btn" onClick={() => setShowSetBudget(true)}>
                      Set Budget
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card budget">
                  <div className="stat-header">
                    <div className="stat-title">Monthly Budget</div>
                    <div className="stat-icon">🎯</div>
                  </div>
                  <div className="stat-value">₹{dashboard.budget?.toFixed(2) || '0.00'}</div>
                  <div className="stat-change positive">+12% from last month</div>
                </div>
                
                <div className="stat-card spent">
                  <div className="stat-header">
                    <div className="stat-title">Total Spent</div>
                    <div className="stat-icon">💸</div>
                  </div>
                  <div className="stat-value">₹{dashboard.spent?.toFixed(2) || '0.00'}</div>
                  <div className="stat-change negative">+8% from last month</div>
                </div>
                
                <div className="stat-card remaining">
                  <div className="stat-header">
                    <div className="stat-title">Remaining</div>
                    <div className="stat-icon">💰</div>
                  </div>
                  <div className="stat-value">₹{dashboard.remaining_budget?.toFixed(2) || '0.00'}</div>
                  <div className="stat-change positive">{dashboard.budget > 0 ? 'Looking good!' : 'Set a budget'}</div>
                </div>
                
                <div className="stat-card week">
                  <div className="stat-header">
                    <div className="stat-title">This Week</div>
                    <div className="stat-icon">📅</div>
                  </div>
                  <div className="stat-value">₹{dashboard.week_spent?.toFixed(2) || '0.00'}</div>
                  <div className="stat-change positive">-5% from last week</div>
                </div>
              </div>
            </div>

            <div className="dashboard-right">

              {/* Budget Progress */}
              <div className="progress-card">
                <div className="progress-header">
                  <div className="progress-title">Budget Progress</div>
                  <div className="progress-percentage">{calculateProgress().toFixed(0)}%</div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
                <div className="progress-details">
                  <span>Spent: ₹{dashboard.spent?.toFixed(2) || '0.00'}</span>
                  <span>Budget: {dashboard.budget > 0 ? `₹${dashboard.budget?.toFixed(2)}` : 'Not set'}</span>
                </div>
              </div>


              {/* Quick Actions */}
              <div className="quick-actions">
                <div className="quick-actions-title">Quick Actions</div>
                <div className="actions-grid">
                  <button className="action-btn" onClick={() => setShowAddExpense(true)}>
                    <div className="action-icon">💸</div>
                    <div className="action-text">Add Expense</div>
                  </button>
                  <button className="action-btn" onClick={() => setShowAddMoney(true)}>
                    <div className="action-icon">💰</div>
                    <div className="action-text">Add Funds</div>
                  </button>
                  <button className="action-btn" onClick={() => setActiveTab('transactions')}>
                    <div className="action-icon">📋</div>
                    <div className="action-text">View History</div>
                  </button>
                  <button className="action-btn" onClick={() => setShowSetBudget(true)}>
                    <div className="action-icon">🎯</div>
                    <div className="action-text">Set Budget</div>
                  </button>
                </div>
              </div>

              {/* Modern Top Categories */}
              {dashboard.category_breakdown && dashboard.category_breakdown.length > 0 && (
                <div className="modern-categories-card">
                  <div className="modern-categories-header">
                    <div className="modern-categories-title">Top Categories</div>
                    <span className="modern-view-all-btn" onClick={() => setActiveTab('expenses')}>View All</span>
                  </div>
                  <div className="modern-category-row">
                    {dashboard.category_breakdown.slice(0, 4).map((cat, index) => (
                      <div key={index} className="modern-category-item">
                        <div className="category-circle-container">
                          <svg className="category-circle" width="80" height="80" viewBox="0 0 80 80">
                            <circle
                              cx="40"
                              cy="40"
                              r="35"
                              fill="none"
                              stroke="#f3f4f6"
                              strokeWidth="6"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="35"
                              fill="none"
                              stroke={cat.category__color || '#6366f1'}
                              strokeWidth="6"
                              strokeDasharray={`${((cat.total / dashboard.spent) * 220) || 0} 220`}
                              strokeLinecap="round"
                              transform="rotate(-90 40 40)"
                            />
                          </svg>
                          <div className="category-circle-content">
                            <div className="category-icon-modern" style={{color: cat.category__color || '#6366f1'}}>
                              {cat.category__icon || cat.category__name?.charAt(0)}
                            </div>
                          </div>
                        </div>
                        <div className="category-details-modern">
                          <div className="category-name-modern">{cat.category__name}</div>
                          <div className="category-amount-modern">₹{cat.total?.toFixed(2)}</div>
                          <div className="category-percentage-modern">{((cat.total / dashboard.spent) * 100 || 0).toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dashboard Reports Section */}
            <div className="dashboard-reports">
              <div className="dashboard-reports-card">
                <div className="reports-header">
                  <div className="reports-title-section">
                    <div className="reports-title">📊 Financial Reports</div>
                    <div className="reports-subtitle">Monthly performance overview</div>
                  </div>
                  <span className="reports-view-all-btn" onClick={() => setActiveTab('reports')}>View All →</span>
                </div>
                <div className="reports-preview">
                  {reports.length === 0 ? (
                    <div className="reports-empty">
                      <div className="empty-icon">📋</div>
                      <p>No reports generated yet</p>
                      <span className="empty-subtitle">Reports will appear here once you have transaction data</span>
                    </div>
                  ) : (
                    <div className="reports-grid-preview">
                      {reports.slice(0, 3).map((report, index) => (
                        <div key={index} className="report-preview-card">
                          <div className="report-card-header">
                            <div className="report-month-info">
                              <span className="report-month">{report.month_name}</span>
                              <span className="report-year">{new Date(report.month + '-01').getFullYear()}</span>
                            </div>
                            <button 
                              className="report-download-btn"
                              onClick={() => downloadReport(report.month)}
                              title="Download Report"
                            >
                              ⬇️
                            </button>
                          </div>
                          <div className="report-summary">
                            <div className="summary-item">
                              <div className="summary-icon income-icon">💰</div>
                              <div className="summary-details">
                                <span className="summary-label">Income</span>
                                <span className="summary-value income">₹{report.income.toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="summary-item">
                              <div className="summary-icon expense-icon">💸</div>
                              <div className="summary-details">
                                <span className="summary-label">Expenses</span>
                                <span className="summary-value expense">₹{report.expenses.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="report-net-savings">
                            <span className="net-label">Net Savings</span>
                            <span className={`net-value ${report.net_savings >= 0 ? 'positive' : 'negative'}`}>
                              {report.net_savings >= 0 ? '+' : ''}₹{report.net_savings.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="expenses-tab">
            <div className="tab-header">
              <h3>Recent Expenses</h3>
              <button className="add-btn" onClick={() => setShowAddExpense(true)}>+ Add Expense</button>
            </div>
            <div className="expenses-list">
              {expenses.length === 0 ? (
                <div className="empty-state">
                  <p>No expenses yet. Add your first expense!</p>
                </div>
              ) : (
                expenses.map(expense => (
                  <div key={expense.id} className="expense-item">
                    <div className="expense-icon" style={{backgroundColor: expense.category_color || '#6366f1'}}>
                      {expense.category_icon || expense.category_name?.charAt(0)}
                    </div>
                    <div className="expense-info">
                      <span className="description">{expense.description}</span>
                      <span className="category">{expense.category_name}</span>
                      <span className="date">{new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                    <div className="expense-actions">
                      <span className="amount">-₹{expense.amount}</span>
                      <button className="delete-btn" onClick={() => deleteExpense(expense.id)}>🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="transactions-tab">
            <div className="tab-header">
              <h3>Transaction History</h3>
            </div>
            <div className="transactions-list">
              {transactions.length === 0 ? (
                <div className="empty-state">
                  <p>No transactions yet.</p>
                </div>
              ) : (
                transactions.map(transaction => (
                  <div key={transaction.id} className={`transaction-item ${transaction.type.toLowerCase()}`}>
                    <div className="transaction-icon">
                      {transaction.type === 'ADD' ? '💰' : '💸'}
                    </div>
                    <div className="transaction-info">
                      <span className="description">{transaction.description}</span>
                      <span className="date">{new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                    <div className="transaction-actions">
                      <span className="amount">
                        {transaction.type === 'ADD' ? '+' : '-'}₹{transaction.amount}
                      </span>
                      <button className="delete-btn" onClick={() => deleteTransaction(transaction.id)}>🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-tab">
            <div className="tab-header">
              <div className="tab-title-section">
                <h3>📊 Financial Reports</h3>
                <p className="tab-subtitle">Comprehensive monthly financial analysis</p>
              </div>
              <div className="tab-controls">
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="month-selector"
                />
              </div>
            </div>
            <div className="reports-grid">
              {reports.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <h4>No Reports Available</h4>
                  <p>Start tracking your expenses to generate monthly reports</p>
                </div>
              ) : (
                reports.slice(0, 6).map((report, index) => (
                  <div key={index} className="report-card-detailed">
                    <div className="report-card-header">
                      <div className="report-title-section">
                        <h4>{report.month_name}</h4>
                        <span className="report-period">{new Date(report.month + '-01').getFullYear()}</span>
                      </div>
                      <div className="report-actions">
                        <button 
                          className="download-btn"
                          onClick={() => downloadReport(report.month)}
                          title="Download Report"
                        >
                          ⬇️ Download
                        </button>
                      </div>
                    </div>
                    <div className="report-metrics">
                      <div className="metric-item">
                        <div className="metric-icon income">💰</div>
                        <div className="metric-info">
                          <span className="metric-label">Total Income</span>
                          <span className="metric-value income">₹{report.income.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="metric-item">
                        <div className="metric-icon expense">💸</div>
                        <div className="metric-info">
                          <span className="metric-label">Total Expenses</span>
                          <span className="metric-value expense">₹{report.expenses.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="report-net-result">
                      <span className="net-label">Net Savings</span>
                      <span className={`net-amount ${report.net_savings >= 0 ? 'positive' : 'negative'}`}>
                        {report.net_savings >= 0 ? '+' : ''}₹{report.net_savings.toFixed(2)}
                        </span>
                      </div>
                      <div className="report-stats">
                        <div className="stat-row">
                          <span className="stat-label">💰 Income:</span>
                          <span className="stat-value income">₹{report.income.toFixed(2)}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">💸 Expenses:</span>
                          <span className="stat-value expense">₹{report.expenses.toFixed(2)}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">🎯 Budget:</span>
                          <span className="stat-value">₹{report.budget.toFixed(2)}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">📊 Transactions:</span>
                          <span className="stat-value">{report.transactions_count}</span>
                        </div>
                      </div>
                      <div className="report-breakdown">
                        <div className="breakdown-item">
                          <span>Income Transactions: {report.income_transactions}</span>
                        </div>
                        <div className="breakdown-item">
                          <span>Expense Transactions: {report.expense_transactions}</span>
                        </div>
                      </div>
                    {report.budget > 0 && (
                      <div className="budget-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${Math.min((report.expenses / report.budget) * 100, 100)}%`,
                              backgroundColor: report.expenses > report.budget ? '#ef4444' : '#10b981'
                            }}
                          ></div>
                        </div>
                        <span className="progress-text">
                          {((report.expenses / report.budget) * 100).toFixed(1)}% of budget used
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        </main>
      </div>

      <button className="fab" onClick={() => setShowAddExpense(true)}>
        +
      </button>

      {/* Modals */}
      {showAddExpense && (
        <div className="modal-overlay" onClick={() => setShowAddExpense(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <form className="modal-form" onSubmit={addExpense}>
              <h3>Add New Expense</h3>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Amount (₹)"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                required
              />
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                required
              />
              <div className="form-actions">
                <button type="submit">Add Expense</button>
                <button type="button" onClick={() => setShowAddExpense(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddMoney && (
        <div className="modal-overlay" onClick={() => setShowAddMoney(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <form className="modal-form" onSubmit={addMoney}>
              <h3>Add Funds</h3>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Amount (₹)"
                value={newMoney.amount}
                onChange={(e) => setNewMoney({...newMoney, amount: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={newMoney.description}
                onChange={(e) => setNewMoney({...newMoney, description: e.target.value})}
                required
              />
              <div className="form-actions">
                <button type="submit">Add Funds</button>
                <button type="button" onClick={() => setShowAddMoney(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSetBudget && (
        <div className="modal-overlay" onClick={() => setShowSetBudget(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <form className="modal-form" onSubmit={setBudget}>
              <h3>Set Monthly Budget</h3>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Budget Amount (₹)"
                value={newBudget.amount}
                onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
                required
              />
              <input
                type="month"
                value={newBudget.month}
                onChange={(e) => setNewBudget({...newBudget, month: e.target.value})}
                required
              />
              <div className="form-actions">
                <button type="submit">Set Budget</button>
                <button type="button" onClick={() => setShowSetBudget(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;