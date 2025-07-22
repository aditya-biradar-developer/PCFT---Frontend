import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import './Forms.css';

const GoalForm = ({ onClose, goalToEdit = null }) => {
  const [formData, setFormData] = useState({
    title: goalToEdit?.title || '',
    targetAmount: goalToEdit?.targetAmount || '',
    category: goalToEdit?.category || 'Other',
    customCategory: '',
    description: goalToEdit?.description || '',
    targetDate: goalToEdit?.targetDate ? goalToEdit.targetDate.split('T')[0] : '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { addGoal, updateGoal } = useFinance();

  const categories = [
    'Emergency Fund', 'Vacation', 'Car', 'House', 
    'Education', 'Investment', 'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.title.trim() || !formData.targetAmount) {
      setError('Title and target amount are required');
      setIsLoading(false);
      return;
    }

    const finalCategory = formData.category === 'Other' && formData.customCategory.trim() 
      ? formData.customCategory.trim() 
      : formData.category;

    const submitData = {
      ...formData,
      category: finalCategory,
    };

    const result = goalToEdit
      ? await updateGoal(goalToEdit._id, submitData)
      : await addGoal(submitData);

    if (result.success) {
      onClose();
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="form-container">
      <h3>{goalToEdit ? 'Edit Goal' : 'Create New Goal'}</h3>
      
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
            placeholder="e.g., Emergency Fund"
            required
          />
        </div>

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
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What is this goal for?"
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Saving...' : goalToEdit ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalForm;