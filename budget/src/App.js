import React, { useState, useEffect } from 'react';
import './App.css';

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
  const [newExpense, setNewExpense] = useState({ 
    amount: '', description: '', category: '', 
    date: new Date().toISOString().split('T')[0] 
  });
  const [newMoney, setNewMoney] = useState({ amount: '', description: 'Added money' });
  const [newBudget, setNewBudget] = useState({ 
    amount: '', 
    month: new Date().toISOString().slice(0, 7) 
  });

  const API_BASE = 'http://192.168.1.43:8000/api';

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
      fetchTransactions()
    ]);
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
    try {
      const response = await fetch(`${API_BASE}/login/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(loginData)
      });
      
      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        setLoginData({ username: '', password: '' });
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login error');
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
      } else if (response.status === 403) {
        setIsAuthenticated(false);
        localStorage.setItem('isAuthenticated', 'false');
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
      } else if (response.status === 403) {
        setIsAuthenticated(false);
        localStorage.setItem('isAuthenticated', 'false');
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
      } else if (response.status === 403) {
        setIsAuthenticated(false);
        localStorage.setItem('isAuthenticated', 'false');
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
      } else if (response.status === 403) {
        setIsAuthenticated(false);
        localStorage.setItem('isAuthenticated', 'false');
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
      } else if (response.status === 403) {
        setIsAuthenticated(false);
        localStorage.setItem('isAuthenticated', 'false');
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
        alert(`Funds added successfully! New balance: $${data.new_balance?.toFixed(2)}`);
      } else if (response.status === 403) {
        setIsAuthenticated(false);
        localStorage.setItem('isAuthenticated', 'false');
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
      } else if (response.status === 403) {
        setIsAuthenticated(false);
        localStorage.setItem('isAuthenticated', 'false');
      } else {
        alert('Failed to set budget. Please try again.');
      }
    } catch (error) {
      console.error('Error setting budget:', error);
      alert('Error setting budget. Please try again.');
    }
  };

  const calculateProgress = () => {
    if (dashboard.budget === 0 || dashboard.budget === null) return 0;
    return Math.min((dashboard.spent / dashboard.budget) * 100, 100);
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
      <header className="header">
        <div className="header-content">
          <h1>💰 BudgetPro</h1>
          <button className="logout-btn" onClick={logout}>Sign Out</button>
        </div>
      </header>

      <nav className="nav-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="tab-icon">📊</span>
          <span className="tab-text">Dashboard</span>
        </button>
        <button 
          className={activeTab === 'expenses' ? 'active' : ''} 
          onClick={() => setActiveTab('expenses')}
        >
          <span className="tab-icon">💸</span>
          <span className="tab-text">Expenses</span>
        </button>
        <button 
          className={activeTab === 'transactions' ? 'active' : ''} 
          onClick={() => setActiveTab('transactions')}
        >
          <span className="tab-icon">📋</span>
          <span className="tab-text">History</span>
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-tab">
            <div className="dashboard-left">
              {/* Hero Card */}
              <div className="hero-card">
                <div className="hero-content">
                  <div className="hero-title">Total Balance</div>
                  <div className="hero-balance">${dashboard.wallet_balance?.toFixed(2) || '0.00'}</div>
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
                  <div className="stat-value">${dashboard.budget?.toFixed(2) || '0.00'}</div>
                  <div className="stat-change positive">+12% from last month</div>
                </div>
                
                <div className="stat-card spent">
                  <div className="stat-header">
                    <div className="stat-title">Total Spent</div>
                    <div className="stat-icon">💸</div>
                  </div>
                  <div className="stat-value">${dashboard.spent?.toFixed(2) || '0.00'}</div>
                  <div className="stat-change negative">+8% from last month</div>
                </div>
                
                <div className="stat-card remaining">
                  <div className="stat-header">
                    <div className="stat-title">Remaining</div>
                    <div className="stat-icon">💰</div>
                  </div>
                  <div className="stat-value">${dashboard.remaining_budget?.toFixed(2) || '0.00'}</div>
                  <div className="stat-change positive">{dashboard.budget > 0 ? 'Looking good!' : 'Set a budget'}</div>
                </div>
                
                <div className="stat-card week">
                  <div className="stat-header">
                    <div className="stat-title">This Week</div>
                    <div className="stat-icon">📅</div>
                  </div>
                  <div className="stat-value">${dashboard.week_spent?.toFixed(2) || '0.00'}</div>
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
                  <span>Spent: ${dashboard.spent?.toFixed(2) || '0.00'}</span>
                  <span>Budget: {dashboard.budget > 0 ? `$${dashboard.budget?.toFixed(2)}` : 'Not set'}</span>
                </div>
              </div>

              {/* Top Categories */}
              {dashboard.category_breakdown && dashboard.category_breakdown.length > 0 && (
                <div className="categories-card">
                  <div className="categories-header">
                    <div className="categories-title">Top Categories</div>
                    <span className="view-all-btn" onClick={() => setActiveTab('expenses')}>View All</span>
                  </div>
                  <div className="category-list">
                    {dashboard.category_breakdown.slice(0, 4).map((cat, index) => (
                      <div key={index} className="category-item">
                        <div className="category-icon" style={{backgroundColor: cat.category__color || '#6366f1'}}>
                          {cat.category__icon || cat.category__name?.charAt(0)}
                        </div>
                        <div className="category-info">
                          <div className="category-name">{cat.category__name}</div>
                          <div className="category-count">{expenses.filter(e => e.category_name === cat.category__name).length} transactions</div>
                          <div className="category-bar">
                            <div 
                              className="category-bar-fill" 
                              style={{ 
                                width: `${(cat.total / dashboard.spent * 100) || 0}%`,
                                backgroundColor: cat.category__color || '#6366f1'
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="category-amount">${cat.total?.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                    <span className="amount">-${expense.amount}</span>
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
                    <span className="amount">
                      {transaction.type === 'ADD' ? '+' : '-'}${transaction.amount}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

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
                placeholder="Amount ($)"
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
                placeholder="Amount ($)"
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
                placeholder="Budget Amount ($)"
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