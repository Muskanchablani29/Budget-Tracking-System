import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeTab, handleTabChange, handlePersonalAccess, logout }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>💰 BudgetPro</h1>
      </div>
      <nav className="sidebar-nav">
        <button 
          className={activeTab === 'dashboard' ? 'nav-item active' : 'nav-item'} 
          onClick={() => handleTabChange('dashboard')}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-text">Dashboard</span>
        </button>
        <button 
          className={activeTab === 'expenses' ? 'nav-item active' : 'nav-item'} 
          onClick={() => handleTabChange('expenses')}
        >
          <span className="nav-icon">💸</span>
          <span className="nav-text">Expenses</span>
        </button>
        <button 
          className={activeTab === 'transactions' ? 'nav-item active' : 'nav-item'} 
          onClick={() => handleTabChange('transactions')}
        >
          <span className="nav-icon">📋</span>
          <span className="nav-text">History</span>
        </button>
        <button 
          className={activeTab === 'reports' ? 'nav-item active' : 'nav-item'} 
          onClick={() => handleTabChange('reports')}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-text">Reports</span>
        </button>
        <button 
          className={activeTab === 'personal' ? 'nav-item active' : 'nav-item'} 
          onClick={() => handlePersonalAccess()}
        >
          <span className="nav-icon">🔒</span>
          <span className="nav-text">Personal</span>
        </button>
      </nav>
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>Sign Out</button>
      </div>
    </div>
  );
};

export default Sidebar;