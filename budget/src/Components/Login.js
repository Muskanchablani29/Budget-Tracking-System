import React from 'react';
import './Login.css';

const Login = ({ loginData, setLoginData, onLogin }) => {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>💰 BudgetPro</h2>
          <p>Your smart financial companion</p>
        </div>
        <form className="login-form" onSubmit={onLogin}>
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
  );
};

export default Login;