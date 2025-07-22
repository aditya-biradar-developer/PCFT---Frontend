import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import './CommunityGoalCard.css';

const CommunityGoalCard = ({ goal }) => {
  const [contributionAmount, setContributionAmount] = useState('');
  const [isContributing, setIsContributing] = useState(false);
  const [showContributeForm, setShowContributeForm] = useState(false);

  const { contributeToCommunityGoal } = useFinance();

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

  const getTotalContributors = () => {
    return goal.contributors ? goal.contributors.length : 0;
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      alert('Please enter a valid contribution amount');
      return;
    }

    setIsContributing(true);
    
    const result = await contributeToCommunityGoal(goal._id, contributionAmount);
    
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

  return (
    <div className={`community-goal-card ${goal.isCompleted ? 'completed' : ''}`}>
      <div className="goal-header">
        <div className="goal-info">
          <h4>{goal.title}</h4>
          <span className="goal-category">{goal.category}</span>
        </div>
        <div className="goal-status">
          {goal.isCompleted ? '✅' : '🤝'}
        </div>
      </div>

      <p className="goal-description">{goal.description}</p>

      <div className="goal-creator">
        <span>Created by: {goal.createdBy?.name || 'Unknown'}</span>
      </div>

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

      <div className="goal-stats">
        <div className="stat-item">
          <span className="stat-value">{getTotalContributors()}</span>
          <span className="stat-label">Contributors</span>
        </div>
        {goal.targetDate && (
          <div className="stat-item">
            <span className="stat-value">{formatDate(goal.targetDate)}</span>
            <span className="stat-label">Target Date</span>
          </div>
        )}
      </div>

      {goal.contributors && goal.contributors.length > 0 && (
        <div className="contributors-list">
          <h5>Top Contributors:</h5>
          <div className="contributors">
            {goal.contributors
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 3)
              .map((contributor, index) => (
                <div key={index} className="contributor">
                  <span className="contributor-name">
                    {contributor.user?.name || 'Anonymous'}
                  </span>
                  <span className="contributor-amount">
                    {formatCurrency(contributor.amount)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {!goal.isCompleted && goal.isActive && (
        <div className="goal-actions">
          {!showContributeForm ? (
            <button 
              className="contribute-btn"
              onClick={() => setShowContributeForm(true)}
            >
              🤝 Contribute
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
          <p>🎉 Goal completed on {formatDate(goal.completedAt)}</p>
        </div>
      )}
    </div>
  );
};

export default CommunityGoalCard;