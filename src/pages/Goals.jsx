import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import GoalCard from '../components/goals/GoalCard';
import GoalForm from '../components/dashboard/GoalForm';
import { useFinance } from '../context/FinanceContext';
import './Pages.css';

const Goals = () => {
  const { goals, isLoading } = useFinance();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const location = useLocation();

  useState(() => {
    const params = new URLSearchParams(location.search);
    const action = params.get('action');
    if (action === 'create') {
      setShowCreateForm(true);
    }
  }, [location]);

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    if (filter === 'active') return !goal.isCompleted;
    if (filter === 'completed') return goal.isCompleted;
    return true;
  });

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const completedGoals = goals.filter(goal => goal.isCompleted).length;

  if (isLoading) {
    return (
      <div className="page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your goals...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page">
        <Navbar />
        
        <div className="page-container">
          <div className="page-header">
            <div>
              <h1>Savings Goals</h1>
              <p>Track your progress towards your financial goals</p>
            </div>
            <button 
              className="primary-btn"
              onClick={() => setShowCreateForm(true)}
            >
              Create New Goal
            </button>
          </div>

          <div className="goals-stats">
            <div className="stat-card">
              <div className="stat-value">{goals.length}</div>
              <div className="stat-label">Total Goals</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{completedGoals}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                ${totalSaved.toLocaleString()}
              </div>
              <div className="stat-label">Total Saved</div>
            </div>
          </div>

          <div className="goals-filters">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Goals</option>
              <option value="active">Active Goals</option>
              <option value="completed">Completed Goals</option>
            </select>
          </div>

          {filteredGoals.length === 0 ? (
            <div className="empty-state">
              <h3>No goals found</h3>
              <p>Start by creating your first savings goal!</p>
            </div>
          ) : (
            <div className="goals-grid">
              {filteredGoals.map(goal => (
                <GoalCard key={goal._id} goal={goal} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateForm && (
        <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-btn" 
              onClick={() => setShowCreateForm(false)}
            >
              ×
            </button>
            <GoalForm onClose={() => setShowCreateForm(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Goals;