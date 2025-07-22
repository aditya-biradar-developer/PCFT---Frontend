import { useAuth } from '../../context/AuthContext';
import './BalanceCard.css';

const BalanceCard = () => {
  const { user } = useAuth();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="balance-card">
      <div className="balance-header">
        <h3>Current Balance</h3>
        <div className="balance-icon">💰</div>
      </div>
      
      <div className="balance-amount">
        <span className={`amount ${user?.balance < 0 ? 'negative' : ''}`}>
          {formatCurrency(user?.balance || 0)}
        </span>
      </div>
      
      <div className="balance-stats">
        <div className="stat-item">
          <span className="stat-label">Total Saved</span>
          <span className="stat-value">{formatCurrency(user?.totalSaved || 0)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Saving Streak</span>
          <span className="stat-value">🔥 {user?.savingStreak || 0} days</span>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;