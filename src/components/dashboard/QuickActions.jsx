import { useState } from 'react';
import IncomeForm from './IncomeForm';
import ExpenseForm from './ExpenseForm';
import GoalForm from './GoalForm';
import CommunityGoalForm from './CommunityGoalForm';
import './QuickActions.css';

const QuickActions = () => {
  const [activeForm, setActiveForm] = useState(null);

  const openForm = (formType) => {
    setActiveForm(formType);
  };

  const closeForm = () => {
    setActiveForm(null);
  };

  return (
    <>
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button 
            className="action-btn income-btn" 
            onClick={() => openForm('income')}
          >
            <div className="btn-icon">💰</div>
            <span>Add Income</span>
          </button>
          
          <button 
            className="action-btn expense-btn" 
            onClick={() => openForm('expense')}
          >
            <div className="btn-icon">💸</div>
            <span>Add Expense</span>
          </button>
          
          <button 
            className="action-btn goal-btn" 
            onClick={() => openForm('goal')}
          >
            <div className="btn-icon">🎯</div>
            <span>New Goal</span>
          </button>
          
          <button 
            className="action-btn community-btn" 
            onClick={() => openForm('community')}
          >
            <div className="btn-icon">🤝</div>
            <span>Community Goal</span>
          </button>
        </div>
      </div>

      {activeForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeForm}>×</button>
            {activeForm === 'income' && <IncomeForm onClose={closeForm} />}
            {activeForm === 'expense' && <ExpenseForm onClose={closeForm} />}
            {activeForm === 'goal' && <GoalForm onClose={closeForm} />}
            {activeForm === 'community' && <CommunityGoalForm onClose={closeForm} />}
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActions;