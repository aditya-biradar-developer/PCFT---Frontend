import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showTransactionDropdown, setShowTransactionDropdown] = useState(false);
  const [showGoalsDropdown, setShowGoalsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <h2>FinanceTracker</h2>
          </Link>
        </div>
        
        <div className="navbar-menu">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          
          <div 
            className="nav-dropdown"
            onMouseEnter={() => setShowTransactionDropdown(true)}
            onMouseLeave={() => setShowTransactionDropdown(false)}
          >
            <Link 
              to="/transactions" 
              className={`nav-link ${isActive('/transactions') ? 'active' : ''}`}
            >
              Transactions
            </Link>
            {showTransactionDropdown && (
              <div className="dropdown-menu">
                <Link to="/transactions" className="dropdown-item">
                  📊 Overview
                </Link>
                <Link to="/transactions?tab=income" className="dropdown-item">
                  💰 Add Income
                </Link>
                <Link to="/transactions?tab=expense" className="dropdown-item">
                  💸 Add Expense
                </Link>
              </div>
            )}
          </div>
          
          <div 
            className="nav-dropdown"
            onMouseEnter={() => setShowGoalsDropdown(true)}
            onMouseLeave={() => setShowGoalsDropdown(false)}
          >
            <Link 
              to="/goals" 
              className={`nav-link ${isActive('/goals') || isActive('/community') ? 'active' : ''}`}
            >
              Goals
            </Link>
            {showGoalsDropdown && (
              <div className="dropdown-menu">
                <Link to="/goals" className="dropdown-item">
                  🎯 Personal Goals
                </Link>
                <Link to="/community" className="dropdown-item">
                  🤝 Community Goals
                </Link>
                <Link to="/goals?action=create" className="dropdown-item">
                  ➕ Add Personal Goal
                </Link>
                <Link to="/community?action=create" className="dropdown-item">
                  ➕ Add Community Goal
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <div className="navbar-right">
          <div className="balance-display">
            <span className="balance-label">Balance:</span>
            <span className={`balance-amount ${user?.balance < 0 ? 'negative' : ''}`}>
              {formatCurrency(user?.balance || 0)}
            </span>
          </div>
          
          <div 
            className="user-profile"
            onMouseEnter={() => setShowProfileDropdown(true)}
            onMouseLeave={() => setShowProfileDropdown(false)}
          >
            <div className="user-info">
              <span className="user-name">Hi, {user?.name}</span>
              <div className="streak-info">
                <span className="streak">🔥 {user?.savingStreak || 0} days</span>
              </div>
            </div>
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <Link to="/profile" className="dropdown-item">
                  👤 Profile
                </Link>
                <button className="dropdown-item logout-item" onClick={logout}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;