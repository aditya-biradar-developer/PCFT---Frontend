import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import BalanceCard from '../components/dashboard/BalanceCard';
import DailySuggestion from '../components/dashboard/DailySuggestion';
import QuickActions from '../components/dashboard/QuickActions';
import GoalCard from '../components/goals/GoalCard';
// import CommunityGoalCard from '../components/community/CommunityGoalCard';
import Timer from '../components/dashboard/Timer';
import { useFinance } from '../context/FinanceContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { goals, communityGoals, isLoading } = useFinance();

  const recentGoals = goals.slice(0, 3);
  const recentCommunityGoals = communityGoals.slice(0, 2);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="welcome-section">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Here's what's happening with your finances today.</p>
        </div>

        <div className="dashboard-grid">
          <div className="main-content">
            <BalanceCard />
            <Timer />
            <DailySuggestion />
            <QuickActions />
          </div>

          <div className="sidebar">
            <div className="recent-goals">
              <h3>Recent Goals</h3>
              {recentGoals.length > 0 ? (
                <div className="goals-list">
                  {recentGoals.map(goal => (
                    <GoalCard key={goal._id} goal={goal} />
                  ))}
                </div>
              ) : (
                <div className="empty-goals">
                  <p>No goals yet. Create your first savings goal!</p>
                </div>
              )}
            </div>

            {/* <div className="recent-community-goals">
              <h3>Community Goals</h3>
              {recentCommunityGoals.length > 0 ? (
                <div className="goals-list">
                  {recentCommunityGoals.map(goal => (
                    <CommunityGoalCard key={goal._id} goal={goal} />
                  ))}
                </div>
              ) : (
                <div className="empty-goals">
                  <p>No community goals yet. Join or create one!</p>
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
