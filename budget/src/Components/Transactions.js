import React from 'react';
import './Transactions.css';

const Transactions = ({ 
  filteredTransactions, 
  transactionFilter, 
  setTransactionFilter, 
  showDescriptions, 
  setShowDescriptions, 
  setShowPasswordModal, 
  deleteTransaction 
}) => {
  return (
    <div className="transactions-tab">
      <div className="tab-header">
        <h3>Transaction History</h3>
        {showDescriptions && (
          <button className="hide-desc-btn" onClick={() => setShowDescriptions(false)}>
            🙈 Hide Descriptions
          </button>
        )}
      </div>
      <div className="filters">
        <select 
          value={transactionFilter.type} 
          onChange={(e) => setTransactionFilter({...transactionFilter, type: e.target.value})}
          className="filter-select"
        >
          <option value="ALL">All Types</option>
          <option value="ADD">💰 Income</option>
          <option value="EXPENSE">💸 Expenses</option>
        </select>
        <input
          type="month"
          value={transactionFilter.month}
          onChange={(e) => setTransactionFilter({...transactionFilter, month: e.target.value})}
          className="filter-month"
          placeholder="Filter by month"
        />
        <button 
          className="clear-filters-btn" 
          onClick={() => setTransactionFilter({ type: 'ALL', month: '' })}
        >
          Clear
        </button>
      </div>
      <div className="transactions-list">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions found. Try adjusting filters.</p>
          </div>
        ) : (
          filteredTransactions.map(transaction => (
            <div key={transaction.id} className={`transaction-item ${transaction.type.toLowerCase()}`}>
              <div className="transaction-icon">
                {transaction.type === 'ADD' ? '💰' : 
                 transaction.type === 'REFUND' ? '🔄' : '💸'}
              </div>
              <div className="transaction-info">
                <span className="description">
                  {showDescriptions ? transaction.description : 'Transaction'}
                </span>
                <span className="date">{new Date(transaction.date).toLocaleDateString()}</span>
              </div>
              <div className="transaction-actions">
                <span className="amount">
                  {(transaction.type === 'ADD' || transaction.type === 'REFUND') ? '+' : '-'}₹{transaction.amount}
                </span>
                {!showDescriptions && (
                  <button 
                    className="show-desc-btn" 
                    onClick={() => setShowPasswordModal(true)}
                    title="Show Description"
                  >
                    👁️
                  </button>
                )}
                <button className="delete-btn" onClick={() => deleteTransaction(transaction.id)}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Transactions;