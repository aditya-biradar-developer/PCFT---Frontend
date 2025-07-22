import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import Navbar from '../components/layout/Navbar';
import './Pages.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const { goals, incomes, expenses } = useFinance();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const completedGoals = goals.filter(goal => goal.isCompleted).length;

  return (
    <div className="page">
      <Navbar />
      
      <div className="page-container">
        <div className="page-header">
          <h1>Profile</h1>
          <p>Your account information and statistics</p>
        </div>

        <div className="profile-content">
          <div className="profile-info">
            <div className="info-card">
              <h3>Account Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name</label>
                  <span>{user?.name}</span>
                </div>
                <div className="info-item">
                  <label>Email Address</label>
                  <span>{user?.email}</span>
                </div>
                <div className="info-item">
                  <label>Current Balance</label>
                  <span className={user?.balance < 0 ? 'negative' : 'positive'}>
                    {formatCurrency(user?.balance || 0)}
                  </span>
                </div>
                <div className="info-item">
                  <label>Saving Streak</label>
                  <span>🔥 {user?.savingStreak || 0} days</span>
                </div>
              </div>
            </div>

            <div className="stats-card">
              <h3>Financial Overview</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{formatCurrency(totalIncome)}</div>
                  <div className="stat-label">Total Income</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{formatCurrency(totalExpenses)}</div>
                  <div className="stat-label">Total Expenses</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{formatCurrency(user?.totalSaved || 0)}</div>
                  <div className="stat-label">Total Saved</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{goals.length}</div>
                  <div className="stat-label">Active Goals</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{completedGoals}</div>
                  <div className="stat-label">Completed Goals</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{incomes.length + expenses.length}</div>
                  <div className="stat-label">Transactions</div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <div className="actions-card">
              <h3>Account Actions</h3>
              <div className="actions-list">
                <button className="action-button secondary">
                  📊 Export Data
                </button>
                <button className="action-button secondary">
                  🔒 Change Password
                </button>
                <button className="action-button secondary">
                  📧 Update Email
                </button>
                <button className="action-button danger" onClick={logout}>
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;