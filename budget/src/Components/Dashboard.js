import React from 'react';
import './Dashboard.css';

const Dashboard = ({ 
  dashboard, 
  reports, 
  setShowAddMoney, 
  setShowSetBudget, 
  setShowAddExpense, 
  handleTabChange, 
  downloadReport 
}) => {
  const calculateProgress = () => {
    if (dashboard.budget === 0 || dashboard.budget === null) return 0;
    return Math.min((dashboard.spent / dashboard.budget) * 100, 100);
  };

  return (
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
              <div className="stat-title">Budget Remaining</div>
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
            <button className="action-btn" onClick={() => handleTabChange('transactions')}>
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
              <span className="modern-view-all-btn" onClick={() => handleTabChange('expenses')}>View All</span>
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
            <span className="reports-view-all-btn" onClick={() => handleTabChange('reports')}>View All →</span>
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
  );
};

export default Dashboard;