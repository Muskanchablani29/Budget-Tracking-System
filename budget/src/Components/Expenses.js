import React from 'react';
import './Expenses.css';

const Expenses = ({ 
  filteredExpenses, 
  categories, 
  expenseFilter, 
  setExpenseFilter, 
  showDescriptions, 
  setShowDescriptions, 
  setShowPasswordModal, 
  setShowAddExpense, 
  deleteExpense,
  updateExpensePaymentMode
}) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthExpenses = filteredExpenses.filter(
    e => new Date(e.date).toISOString().slice(0, 7) === currentMonth
  );
  const currentMonthTotal = currentMonthExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const currentMonthCash = currentMonthExpenses.filter(e => e.payment_mode === 'CASH').reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const currentMonthOnline = currentMonthExpenses.filter(e => e.payment_mode === 'ONLINE').reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const currentMonthLabel = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="expenses-tab">
      <div className="expenses-summary-bar">
        <div className="expenses-summary-left">
          <span className="expenses-summary-label">Total Spent — {currentMonthLabel}</span>
          <span className="expenses-summary-amount">₹{currentMonthTotal.toFixed(2)}</span>
        </div>
        <div className="expenses-summary-right">
          <div className="expenses-summary-breakdown">
            <div className="summary-mode cash-summary">
              <span className="mode-label">💵 Cash</span>
              <span className="mode-amount">₹{currentMonthCash.toFixed(2)}</span>
            </div>
            <div className="summary-mode online-summary">
              <span className="mode-label">💳 Online</span>
              <span className="mode-amount">₹{currentMonthOnline.toFixed(2)}</span>
            </div>
            <div className="summary-mode count-summary">
              <span className="mode-label">🧾 Count</span>
              <span className="mode-amount">{currentMonthExpenses.length} expense{currentMonthExpenses.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="tab-header">
        <h3>Recent Expenses</h3>
        <div className="header-actions">
          {showDescriptions && (
            <button className="hide-desc-btn" onClick={() => setShowDescriptions(false)}>
              🙈 Hide Descriptions
            </button>
          )}
          <button className="add-btn" onClick={() => setShowAddExpense(true)}>+ Add Expense</button>
        </div>
      </div>
      <div className="filters">
        <select 
          value={expenseFilter.payment_mode || 'ALL'} 
          onChange={(e) => setExpenseFilter({...expenseFilter, payment_mode: e.target.value})}
          className="filter-select"
        >
          <option value="ALL">All Payments</option>
          <option value="CASH">💵 Cash</option>
          <option value="ONLINE">💳 Online</option>
        </select>
        <select 
          value={expenseFilter.category} 
          onChange={(e) => setExpenseFilter({...expenseFilter, category: e.target.value})}
          className="filter-select"
        >
          <option value="ALL">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
          ))}
        </select>
        <input
          type="month"
          value={expenseFilter.month}
          onChange={(e) => setExpenseFilter({...expenseFilter, month: e.target.value})}
          className="filter-month"
          placeholder="Filter by month"
        />
        <button 
          className="clear-filters-btn" 
          onClick={() => setExpenseFilter({ category: 'ALL', month: '' })}
        >
          Clear
        </button>
      </div>
      <div className="expenses-list">
        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <p>No expenses found. Try adjusting filters.</p>
          </div>
        ) : (
          filteredExpenses.map(expense => (
            <div key={expense.id} className="expense-item">
              <div className="expense-icon" style={{backgroundColor: expense.category_color || '#6366f1'}}>
                {expense.category_icon || expense.category_name?.charAt(0)}
              </div>
              <div className="expense-info">
                <span className="description">{showDescriptions ? expense.description : 'Expense'}</span>
                <span className="category">{expense.category_name}</span>
                <span className="date">{new Date(expense.date).toLocaleDateString()}</span>
                <span 
                  className={`payment-badge ${expense.payment_mode?.toLowerCase()} clickable`}
                  onClick={() => updateExpensePaymentMode(expense.id, expense.payment_mode === 'CASH' ? 'ONLINE' : 'CASH')}
                  title="Click to toggle Cash / Online"
                >
                  {expense.payment_mode === 'ONLINE' ? '💳 Online' : '💵 Cash'} ✎
                </span>
              </div>
              <div className="expense-actions">
                <span className="amount">-₹{expense.amount}</span>
                {!showDescriptions && (
                  <button 
                    className="show-desc-btn" 
                    onClick={() => setShowPasswordModal(true)}
                    title="Show Description"
                  >
                    👁️
                  </button>
                )}
                <button className="delete-btn" onClick={() => deleteExpense(expense.id)}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Expenses;