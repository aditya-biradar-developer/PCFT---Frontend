import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import CommunityGoalCard from '../components/community/CommunityGoalCard';
import { useFinance } from '../context/FinanceContext';
import './Pages.css';
import './Community.css';

const Community = () => {
  const { communityGoals, createCommunityGoal, isLoading } = useFinance();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [inviteEmails, setInviteEmails] = useState('');
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    category: 'Other',
    targetDate: '',
    inviteEmails: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useState(() => {
    const params = new URLSearchParams(location.search);
    const action = params.get('action');
    if (action === 'create') {
      setShowCreateForm(true);
    }
  }, [location]);

  const categories = ['Charity', 'Environment', 'Education', 'Healthcare', 'Community', 'Other'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await createCommunityGoal(formData);
    
    if (result.success) {
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        targetAmount: '',
        category: 'Other',
        targetDate: '',
        inviteEmails: '',
      });
      alert('Community goal created successfully!');
    } else {
      alert(result.message);
    }
    
    setIsSubmitting(false);
  };

  const handleInviteMembers = async (e) => {
    e.preventDefault();
    
    if (!inviteEmails.trim()) {
      alert('Please enter at least one email address');
      return;
    }

    const emails = inviteEmails.split(',').map(email => email.trim()).filter(email => email);
    
    // Here you would typically send invitations to the backend
    // For now, we'll just show a success message
    alert(`Invitations sent to: ${emails.join(', ')}`);
    
    setShowInviteForm(false);
    setInviteEmails('');
    setSelectedGoal(null);
  };

  const totalRaised = communityGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const completedGoals = communityGoals.filter(goal => goal.isCompleted).length;

  if (isLoading) {
    return (
      <div className="page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading community goals...</p>
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
              <h1>Community Goals</h1>
              <p>Join forces with others to achieve meaningful impact</p>
            </div>
            <button 
              className="primary-btn"
              onClick={() => setShowCreateForm(true)}
            >
              Create Community Goal
            </button>
          </div>

          <div className="community-stats">
            <div className="stat-card">
              <div className="stat-value">{communityGoals.length}</div>
              <div className="stat-label">Active Goals</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{completedGoals}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                ${totalRaised.toLocaleString()}
              </div>
              <div className="stat-label">Total Raised</div>
            </div>
          </div>

          {communityGoals.length === 0 ? (
            <div className="empty-state">
              <h3>No community goals yet</h3>
              <p>Be the first to create a community goal and make an impact!</p>
            </div>
          ) : (
            <div className="community-goals-grid">
              {communityGoals.map(goal => (
                <div key={goal._id} className="goal-wrapper">
                  <CommunityGoalCard goal={goal} />
                  <button 
                    className="invite-btn"
                    onClick={() => {
                      setSelectedGoal(goal);
                      setShowInviteForm(true);
                    }}
                  >
                    📧 Invite Members
                  </button>
                </div>
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
            
            <div className="form-container">
              <h3>Create Community Goal</h3>
              
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
                  <label htmlFor="inviteEmails">Invite Members (Optional)</label>
                  <textarea
                    id="inviteEmails"
                    name="inviteEmails"
                    value={formData.inviteEmails}
                    onChange={handleChange}
                    placeholder="Enter email addresses separated by commas (e.g., user1@email.com, user2@email.com)"
                    rows="3"
                  />
                  <small className="form-help">Members will receive an invitation to join this community goal</small>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Goal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showInviteForm && (
        <div className="modal-overlay" onClick={() => setShowInviteForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-btn" 
              onClick={() => setShowInviteForm(false)}
            >
              ×
            </button>
            
            <div className="form-container">
              <h3>Invite Members to "{selectedGoal?.title}"</h3>
              
              <form onSubmit={handleInviteMembers}>
                <div className="form-group">
                  <label htmlFor="inviteEmails">Email Addresses</label>
                  <textarea
                    id="inviteEmails"
                    value={inviteEmails}
                    onChange={(e) => setInviteEmails(e.target.value)}
                    placeholder="Enter email addresses separated by commas&#10;Example: john@email.com, jane@email.com, mike@email.com"
                    rows="4"
                    required
                  />
                  <small className="form-help">
                    Separate multiple email addresses with commas. Invited members will be able to contribute to this goal.
                  </small>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setShowInviteForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                  >
                    Send Invitations
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Community;