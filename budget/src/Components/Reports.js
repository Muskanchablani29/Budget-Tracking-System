import React from 'react';
import './Reports.css';

const Reports = ({ reports, selectedMonth, setSelectedMonth, downloadReport }) => {
  return (
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
  );
};

export default Reports;