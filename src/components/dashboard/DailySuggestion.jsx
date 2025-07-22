import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import './DailySuggestion.css';

const DailySuggestion = () => {
  const { user } = useAuth();
  const { goals } = useFinance();
  const [suggestion, setSuggestion] = useState('');

  useEffect(() => {
    generateDailySuggestion();
  }, [user, goals]);

  const generateDailySuggestion = () => {
    if (!user || !goals.length) return;

    const suggestions = [];

    // Balance-based suggestions
    if (user.balance > 1000) {
      suggestions.push("💡 Great balance! Consider contributing to your savings goals.");
    } else if (user.balance > 0) {
      suggestions.push("💡 Try to save a small amount today to build your emergency fund.");
    } else {
      suggestions.push("💡 Focus on tracking expenses today to get back on track.");
    }

    // Goal-based suggestions
    const incompleteGoals = goals.filter(goal => !goal.isCompleted);
    if (incompleteGoals.length > 0) {
      const randomGoal = incompleteGoals[Math.floor(Math.random() * incompleteGoals.length)];
      const remaining = randomGoal.targetAmount - randomGoal.currentAmount;
      suggestions.push(`🎯 Consider contributing $${Math.min(remaining, 20).toFixed(2)} to "${randomGoal.title}" today.`);
    }

    // Streak-based suggestions
    if (user.savingStreak === 0) {
      suggestions.push("🔥 Start your saving streak today! Even $1 counts.");
    } else if (user.savingStreak >= 7) {
      suggestions.push(`🔥 Amazing ${user.savingStreak}-day streak! Keep it going!`);
    }

    // Time-based suggestions
    const hour = new Date().getHours();
    if (hour < 12) {
      suggestions.push("🌅 Good morning! Set a daily spending limit to stay on track.");
    } else if (hour < 18) {
      suggestions.push("☀️ Afternoon check-in: How are your expenses looking today?");
    } else {
      suggestions.push("🌙 Evening reflection: Review today's transactions and plan tomorrow's budget.");
    }

    // Select a random suggestion
    setSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
  };

  return (
    <div className="daily-suggestion">
      <div className="suggestion-header">
        <h3>Daily Tip</h3>
        <button className="refresh-btn" onClick={generateDailySuggestion}>
          🔄
        </button>
      </div>
      <p className="suggestion-text">{suggestion}</p>
    </div>
  );
};

export default DailySuggestion;