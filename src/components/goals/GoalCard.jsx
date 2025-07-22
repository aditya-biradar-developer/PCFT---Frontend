import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import './GoalCard.css';

const GoalCard = ({ goal }) => {
  const [contributionAmount, setContributionAmount] = useState('');
  const [isContributing, setIsContributing] = useState(false);
  const [showContributeForm, setShowContributeForm] = useState(false);

  const { contributeToGoal } = useFinance();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'No target date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateProgress = () => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const calculateDailySavings = () => {
    if (!goal.targetDate) return null;
    
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining <= 0) return null;
    
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    const dailySavings = remainingAmount / daysRemaining;
    
    return { daysRemaining, dailySavings };
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      alert('Please enter a valid contribution amount');
      return;
    }

    setIsContributing(true);
    
    const result = await contributeToGoal(goal._id, contributionAmount);
    
    if (result.success) {
      setContributionAmount('');
      setShowContributeForm(false);
      alert(result.message);
    } else {
      alert(result.message);
    }
    
    setIsContributing(false);
  };

  const progress = calculateProgress();
  const savingsInfo = calculateDailySavings();

  return (
    <div className={`goal-card ${goal.isCompleted ? 'completed' : ''}`}>
      <div className="goal-header">
        <div className="goal-info">
          <h4>{goal.title}</h4>
          <span className="goal-category">{goal.category}</span>
        </div>
        <div className="goal-status">
          {goal.isCompleted ? '✅' : '🎯'}
        </div>
      </div>

      {goal.description && (
        <p className="goal-description">{goal.description}</p>
      )}

      <div className="goal-progress">
        <div className="progress-info">
          <span>{formatCurrency(goal.currentAmount)}</span>
          <span>{formatCurrency(goal.targetAmount)}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="progress-percentage">
          {progress.toFixed(1)}% Complete
        </div>
      </div>

      {goal.targetDate && (
        <div className="goal-date">
          <div className="date-info">
            <span>Target: {formatDate(goal.targetDate)}</span>
            {savingsInfo && (
              <span className="daily-savings">
                Save {formatCurrency(savingsInfo.dailySavings)}/day for {savingsInfo.daysRemaining} days
              </span>
            )}
          </div>
        </div>
      )}

      {!goal.isCompleted && (
        <div className="goal-actions">
          {!showContributeForm ? (
            <button 
              className="contribute-btn"
              onClick={() => setShowContributeForm(true)}
            >
              💰 Contribute
            </button>
          ) : (
            <form className="contribute-form" onSubmit={handleContribute}>
              <input
                type="number"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder="Amount to contribute"
                step="0.01"
                min="0.01"
                required
              />
              <div className="contribute-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowContributeForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isContributing}
                >
                  {isContributing ? 'Contributing...' : 'Contribute'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {goal.isCompleted && goal.completedAt && (
        <div className="completion-info">
          <p>🎉 Completed on {formatDate(goal.completedAt)}</p>
        </div>
      )}
    </div>
  );
};

export default GoalCard;