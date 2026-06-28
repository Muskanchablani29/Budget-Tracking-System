import React from 'react';
import './Modals.css';

const Modals = ({
  showAddExpense,
  setShowAddExpense,
  newExpense,
  setNewExpense,
  categories,
  addExpense,
  showPasswordModal,
  setShowPasswordModal,
  passwordInput,
  setPasswordInput,
  handlePasswordSubmit,
  showAddPerson,
  setShowAddPerson,
  newPerson,
  setNewPerson,
  addPerson,
  showAddPersonalTransaction,
  setShowAddPersonalTransaction,
  newPersonalTransaction,
  setNewPersonalTransaction,
  people,
  addPersonalTransaction,
  showAddMoney,
  setShowAddMoney,
  newMoney,
  setNewMoney,
  addMoney,
  showSetBudget,
  setShowSetBudget,
  newBudget,
  setNewBudget,
  setBudget,
  showAddPersonalRecord,
  setShowAddPersonalRecord,
  newPersonalRecord,
  setNewPersonalRecord,
  addPersonalRecord
}) => {
  return (
    <>
      {/* Add Expense Modal */}
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

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <form className="modal-form" onSubmit={handlePasswordSubmit}>
              <h3>🔒 Enter Password</h3>
              <p>Enter password to view transaction descriptions</p>
              <input
                type="password"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                autoFocus
              />
              <div className="form-actions">
                <button type="submit">Unlock</button>
                <button type="button" onClick={() => setShowPasswordModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Person Modal */}
      {showAddPerson && (
        <div className="modal-overlay" onClick={() => setShowAddPerson(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <form className="modal-form" onSubmit={addPerson}>
              <h3>Add New Person</h3>
              <input
                type="text"
                placeholder="Name"
                value={newPerson.name}
                onChange={(e) => setNewPerson({...newPerson, name: e.target.value})}
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={newPerson.description}
                onChange={(e) => setNewPerson({...newPerson, description: e.target.value})}
                rows="3"
              />
              <select
                value={newPerson.relationship}
                onChange={(e) => setNewPerson({...newPerson, relationship: e.target.value})}
                required
              >
                <option value="FAMILY">👨👩👧👦 Family</option>
                <option value="FRIEND">👫 Friend</option>
                <option value="COLLEAGUE">👥 Colleague</option>
                <option value="BUSINESS">💼 Business</option>
                <option value="OTHER">👤 Other</option>
              </select>
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={newPerson.phone}
                onChange={(e) => setNewPerson({...newPerson, phone: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={newPerson.email}
                onChange={(e) => setNewPerson({...newPerson, email: e.target.value})}
              />
              <div className="form-actions">
                <button type="submit">Add Person</button>
                <button type="button" onClick={() => setShowAddPerson(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Personal Transaction Modal */}
      {showAddPersonalTransaction && (
        <div className="modal-overlay" onClick={() => setShowAddPersonalTransaction(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <form className="modal-form" onSubmit={addPersonalTransaction}>
              <h3>Add Personal Transaction</h3>
              <select
                value={newPersonalTransaction.person}
                onChange={(e) => setNewPersonalTransaction({...newPersonalTransaction, person: e.target.value})}
                required
              >
                <option value="">Select Person</option>
                {people.map(person => (
                  <option key={person.id} value={person.id}>{person.name} ({person.relationship})</option>
                ))}
              </select>
              <select
                value={newPersonalTransaction.type}
                onChange={(e) => setNewPersonalTransaction({...newPersonalTransaction, type: e.target.value})}
                required
              >
                <option value="LENT">💰 Money Lent</option>
                <option value="BORROWED">💸 Money Borrowed</option>
                <option value="RECEIVED">✅ Money Received Back</option>
                <option value="PAID_BACK">🔄 Money Paid Back</option>
              </select>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Amount (₹)"
                value={newPersonalTransaction.amount}
                onChange={(e) => setNewPersonalTransaction({...newPersonalTransaction, amount: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={newPersonalTransaction.description}
                onChange={(e) => setNewPersonalTransaction({...newPersonalTransaction, description: e.target.value})}
                required
              />
              <input
                type="date"
                value={newPersonalTransaction.date}
                onChange={(e) => setNewPersonalTransaction({...newPersonalTransaction, date: e.target.value})}
                required
              />
              <div className="form-actions">
                <button type="submit">Add Transaction</button>
                <button type="button" onClick={() => setShowAddPersonalTransaction(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Money Modal */}
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

      {/* Set Budget Modal */}
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

      {/* Add Personal Record Modal */}
      {showAddPersonalRecord && (
        <div className="modal-overlay" onClick={() => setShowAddPersonalRecord(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <form className="modal-form" onSubmit={addPersonalRecord}>
              <h3>Add Personal Record</h3>
              <select
                value={newPersonalRecord.type}
                onChange={(e) => setNewPersonalRecord({...newPersonalRecord, type: e.target.value})}
                required
              >
                <option value="EXPENSE">Personal Expense</option>
                <option value="LENT">Money Lent</option>
                <option value="BORROWED">Money Borrowed</option>
                <option value="RECEIVED">Money Received Back</option>
                <option value="PAID_BACK">Money Paid Back</option>
              </select>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Amount (₹)"
                value={newPersonalRecord.amount}
                onChange={(e) => setNewPersonalRecord({...newPersonalRecord, amount: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={newPersonalRecord.description}
                onChange={(e) => setNewPersonalRecord({...newPersonalRecord, description: e.target.value})}
                required
              />
              {(newPersonalRecord.type === 'LENT' || newPersonalRecord.type === 'BORROWED' || 
                newPersonalRecord.type === 'RECEIVED' || newPersonalRecord.type === 'PAID_BACK') && (
                <input
                  type="text"
                  placeholder="Person Name"
                  value={newPersonalRecord.person_name}
                  onChange={(e) => setNewPersonalRecord({...newPersonalRecord, person_name: e.target.value})}
                  required
                />
              )}
              <input
                type="date"
                value={newPersonalRecord.date}
                onChange={(e) => setNewPersonalRecord({...newPersonalRecord, date: e.target.value})}
                required
              />
              <div className="form-actions">
                <button type="submit">Add Record</button>
                <button type="button" onClick={() => setShowAddPersonalRecord(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Modals;