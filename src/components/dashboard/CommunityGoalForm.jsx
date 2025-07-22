import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import './Forms.css';

const CommunityGoalForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    category: 'Other',
    customCategory: '',
    targetDate: '',
    memberEmails: '',
    maxMembers: '5',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { createCommunityGoal } = useFinance();

  const categories = ['Charity', 'Environment', 'Education', 'Healthcare', 'Community', 'Other'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculatePerPersonAmount = () => {
    const totalAmount = parseFloat(formData.targetAmount) || 0;
    const maxMembers = parseInt(formData.maxMembers) || 1;
    const perPerson = totalAmount / maxMembers;
    
    if (formData.targetDate && totalAmount > 0) {
      const today = new Date();
      const targetDate = new Date(formData.targetDate);
      const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysRemaining > 0) {
        const dailyAmount = perPerson / daysRemaining;
        return {
          perPerson: perPerson.toFixed(2),
          dailyAmount: dailyAmount.toFixed(2),
          daysRemaining
        };
      }
    }
    
    return {
      perPerson: perPerson.toFixed(2),
      dailyAmount: '0.00',
      daysRemaining: 0
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.title.trim() || !formData.targetAmount || !formData.description.trim()) {
      setError('Title, description, and target amount are required');
      setIsLoading(false);
      return;
    }

    const finalCategory = formData.category === 'Other' && formData.customCategory.trim() 
      ? formData.customCategory.trim() 
      : formData.category;

    const goalData = {
      ...formData,
      category: finalCategory,
      inviteEmails: formData.memberEmails,
    };

    const result = await createCommunityGoal(goalData);

    if (result.success) {
      onClose();
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  const calculation = calculatePerPersonAmount();

  return (
    <div className="form-container">
      <h3>Create Community Goal</h3>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Goal Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Plant 1000 Trees"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the purpose and impact of this goal..."
            rows="4"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="targetAmount">Target Amount ($)</label>
            <input
              type="number"
              id="targetAmount"
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxMembers">Max Members</label>
            <input
              type="number"
              id="maxMembers"
              name="maxMembers"
              value={formData.maxMembers}
              onChange={handleChange}
              min="1"
              max="50"
              required
            />
          </div>
        </div>

        {formData.targetAmount && formData.maxMembers && (
          <div className="calculation-display">
            <div className="calc-item">
              <span className="calc-label">Per Person:</span>
              <span className="calc-value">${calculation.perPerson}</span>
            </div>
            {calculation.daysRemaining > 0 && (
              <div className="calc-item">
                <span className="calc-label">Daily per person:</span>
                <span className="calc-value">${calculation.dailyAmount} for {calculation.daysRemaining} days</span>
              </div>
            )}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {formData.category === 'Other' && (
          <div className="form-group">
            <label htmlFor="customCategory">Custom Category</label>
            <input
              type="text"
              id="customCategory"
              name="customCategory"
              value={formData.customCategory}
              onChange={handleChange}
              placeholder="Enter custom category name"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="targetDate">Target Date (Optional)</label>
          <input
            type="date"
            id="targetDate"
            name="targetDate"
            value={formData.targetDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-group">
          <label htmlFor="memberEmails">Invite Members (Optional)</label>
          <textarea
            id="memberEmails"
            name="memberEmails"
            value={formData.memberEmails}
            onChange={handleChange}
            placeholder="Enter email addresses separated by commas&#10;Example: john@email.com, jane@email.com"
            rows="3"
          />
          <small className="form-help">
            Members will receive an invitation to join this community goal
          </small>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Goal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommunityGoalForm;