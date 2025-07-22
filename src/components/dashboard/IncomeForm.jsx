import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import './Forms.css';

const IncomeForm = ({ onClose, incomeToEdit = null }) => {
  const [formData, setFormData] = useState({
    title: incomeToEdit?.title || '',
    amount: incomeToEdit?.amount || '',
    category: incomeToEdit?.category || 'Other',
    description: incomeToEdit?.description || '',
    date: incomeToEdit?.date ? incomeToEdit.date.split('T')[0] : new Date().toISOString().split('T')[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { addIncome, updateIncome } = useFinance();

  const categories = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'];

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

    if (!formData.title.trim() || !formData.amount) {
      setError('Title and amount are required');
      setIsLoading(false);
      return;
    }

    const result = incomeToEdit
      ? await updateIncome(incomeToEdit._id, formData)
      : await addIncome(formData);

    if (result.success) {
      onClose();
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="form-container">
      <h3>{incomeToEdit ? 'Edit Income' : 'Add New Income'}</h3>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Monthly Salary"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
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

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add notes about this income..."
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Saving...' : incomeToEdit ? 'Update Income' : 'Add Income'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IncomeForm;
