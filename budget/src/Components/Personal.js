import React from 'react';
import './Personal.css';

const Personal = ({ 
  personalAccess,
  personalSummary,
  personalRecords,
  people,
  personalTransactions,
  personalDashboard,
  setShowAddPersonalRecord,
  setShowAddPerson,
  setShowAddPersonalTransaction,
  setSelectedPerson,
  setNewPersonalTransaction,
  newPersonalTransaction,
  deletePersonalRecord,
  toggleSettlement
}) => {
  if (!personalAccess) {
    return null;
  }

  return (
    <div className="personal-tab">
      <div className="tab-header">
        <div className="tab-title-section">
          <h3>🔒 Personal Diary</h3>
          <p className="tab-subtitle">Private expense and loan tracking</p>
        </div>
        <button className="add-btn" onClick={() => setShowAddPersonalRecord(true)}>+ Add Record</button>
      </div>
      
      <div className="personal-summary">
        <div className="summary-cards">
          <div className="summary-card lent">
            <div className="summary-icon">💰</div>
            <div className="summary-info">
              <span className="summary-label">Money Lent</span>
              <span className="summary-value">₹{personalSummary.total_lent?.toFixed(2) || '0.00'}</span>
              <span className="summary-count">{personalSummary.pending_lent || 0} pending</span>
            </div>
          </div>
          <div className="summary-card borrowed">
            <div className="summary-icon">💸</div>
            <div className="summary-info">
              <span className="summary-label">Money Borrowed</span>
              <span className="summary-value">₹{personalSummary.total_borrowed?.toFixed(2) || '0.00'}</span>
              <span className="summary-count">{personalSummary.pending_borrowed || 0} pending</span>
            </div>
          </div>
          <div className="summary-card expenses">
            <div className="summary-icon">📄</div>
            <div className="summary-info">
              <span className="summary-label">Personal Expenses</span>
              <span className="summary-value">₹{personalSummary.total_expenses?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
          <div className="summary-card net">
            <div className="summary-icon">📊</div>
            <div className="summary-info">
              <span className="summary-label">Net Lending</span>
              <span className={`summary-value ${(personalSummary.net_lending || 0) >= 0 ? 'positive' : 'negative'}`}>
                ₹{personalSummary.net_lending?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="personal-records">
        {personalRecords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h4>No Personal Records</h4>
            <p>Start tracking your personal expenses and loans</p>
          </div>
        ) : (
          <div className="records-list">
            {personalRecords.map(record => (
              <div key={record.id} className={`record-item ${record.type.toLowerCase()}`}>
                <div className="record-icon">
                  {record.type === 'EXPENSE' && '💸'}
                  {record.type === 'LENT' && '💰'}
                  {record.type === 'BORROWED' && '💵'}
                  {record.type === 'RECEIVED' && '✅'}
                  {record.type === 'PAID_BACK' && '✅'}
                </div>
                <div className="record-info">
                  <span className="record-description">{record.description}</span>
                  {record.person_name && (
                    <span className="record-person">Person: {record.person_name}</span>
                  )}
                  <span className="record-date">{new Date(record.date).toLocaleDateString()}</span>
                  <span className="record-type">{record.type.replace('_', ' ')}</span>
                </div>
                <div className="record-actions">
                  <span className="record-amount">₹{record.amount}</span>
                  {(record.type === 'LENT' || record.type === 'BORROWED') && (
                    <button 
                      className={`settlement-btn ${record.is_settled ? 'settled' : 'pending'}`}
                      onClick={() => toggleSettlement(record.id)}
                    >
                      {record.is_settled ? '✅ Settled' : '⏳ Pending'}
                    </button>
                  )}
                  <button className="delete-btn" onClick={() => deletePersonalRecord(record.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* People & Balances Section */}
      <div className="people-section">
        <div className="section-header">
          <h4>👥 People & Balances</h4>
          <div className="section-actions">
            <button className="add-btn" onClick={() => setShowAddPerson(true)}>+ Add Person</button>
            <button className="add-btn" onClick={() => setShowAddPersonalTransaction(true)}>+ Add Transaction</button>
          </div>
        </div>

        {/* Personal Dashboard */}
        <div className="personal-dashboard">
          <div className="personal-stats">
            <div className="personal-stat-card lent">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <div className="stat-label">Total Lent</div>
                <div className="stat-value">₹{personalDashboard.total_lent?.toFixed(2) || '0.00'}</div>
              </div>
            </div>
            <div className="personal-stat-card borrowed">
              <div className="stat-icon">💸</div>
              <div className="stat-info">
                <div className="stat-label">Total Borrowed</div>
                <div className="stat-value">₹{personalDashboard.total_borrowed?.toFixed(2) || '0.00'}</div>
              </div>
            </div>
            <div className="personal-stat-card balance">
              <div className="stat-icon">⚖️</div>
              <div className="stat-info">
                <div className="stat-label">Net Balance</div>
                <div className={`stat-value ${personalDashboard.net_balance >= 0 ? 'positive' : 'negative'}`}>
                  ₹{personalDashboard.net_balance?.toFixed(2) || '0.00'}
                </div>
              </div>
            </div>
            <div className="personal-stat-card people">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <div className="stat-label">People</div>
                <div className="stat-value">{personalDashboard.people_count || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* People List */}
        <div className="people-grid">
          {people.length === 0 ? (
            <div className="empty-state">
              <p>No people added yet. Add someone to start tracking money!</p>
            </div>
          ) : (
            people.map(person => (
              <div key={person.id} className="person-card">
                <div className="person-header">
                  <div className="person-info">
                    <div className="person-name">{person.name}</div>
                    <div className="person-relationship">{person.relationship}</div>
                  </div>
                  <div className={`person-balance ${person.balance >= 0 ? 'positive' : 'negative'}`}>
                    ₹{person.balance?.toFixed(2)}
                  </div>
                </div>
                {person.description && (
                  <div className="person-description">{person.description}</div>
                )}
                <div className="person-actions">
                  <button 
                    className="person-btn" 
                    onClick={() => {
                      setSelectedPerson(person);
                      setNewPersonalTransaction({...newPersonalTransaction, person: person.id});
                      setShowAddPersonalTransaction(true);
                    }}
                  >
                    Add Transaction
                  </button>
                  {person.balance !== 0 && (
                    <span className="balance-status">
                      {person.balance > 0 ? 'Owes you' : 'You owe'}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recent Personal Transactions */}
        <div className="personal-transactions-section">
          <h4>Recent Transactions</h4>
          <div className="personal-transactions-list">
            {personalTransactions.length === 0 ? (
              <div className="empty-state">
                <p>No personal transactions yet.</p>
              </div>
            ) : (
              personalTransactions.slice(0, 10).map(transaction => (
                <div key={transaction.id} className={`personal-transaction-item ${transaction.type.toLowerCase()}`}>
                  <div className="transaction-icon">
                    {transaction.type === 'LENT' ? '💰' : 
                     transaction.type === 'BORROWED' ? '💸' :
                     transaction.type === 'RECEIVED' ? '✅' : '🔄'}
                  </div>
                  <div className="transaction-info">
                    <div className="transaction-main">
                      <span className="description">{transaction.description}</span>
                      <span className="person-name">{transaction.person_name}</span>
                    </div>
                    <span className="date">{new Date(transaction.date).toLocaleDateString()}</span>
                  </div>
                  <div className="transaction-amount">
                    <span className={`amount ${transaction.type === 'LENT' || transaction.type === 'RECEIVED' ? 'positive' : 'negative'}`}>
                      {transaction.type === 'LENT' || transaction.type === 'BORROWED' ? '+' : ''}₹{transaction.amount}
                    </span>
                    <span className="transaction-type">{transaction.type}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personal;