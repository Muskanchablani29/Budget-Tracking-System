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
  deleteExpense 
}) => {
  return (
    <div className="expenses-tab">
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