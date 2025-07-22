import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const FinanceContext = createContext();

export const useFinance = () => {
  return useContext(FinanceContext);
};

export const FinanceProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [communityGoals, setCommunityGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUserBalance } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchIncomes(),
        fetchExpenses(),
        fetchGoals(),
        fetchCommunityGoals(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIncomes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/income');
      setIncomes(response.data);
    } catch (error) {
      console.error('Error fetching incomes:', error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/goals');
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const fetchCommunityGoals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/community');
      setCommunityGoals(response.data);
    } catch (error) {
      console.error('Error fetching community goals:', error);
    }
  };

  const addIncome = async (incomeData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/income', incomeData);
      setIncomes([response.data, ...incomes]);
      await updateUserBalance();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add income',
      };
    }
  };

  const addExpense = async (expenseData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/expenses', expenseData);
      setExpenses([response.data, ...expenses]);
      await updateUserBalance();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add expense',
      };
    }
  };

  const addGoal = async (goalData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/goals', goalData);
      setGoals([response.data, ...goals]);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add goal',
      };
    }
  };

  const contributeToGoal = async (goalId, amount) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/goals/${goalId}/contribute`, { amount });
      await fetchGoals();
      await fetchExpenses();
      await updateUserBalance();
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to contribute to goal',
      };
    }
  };

  const contributeToCommunityGoal = async (goalId, amount) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/community/${goalId}/contribute`, { amount });
      await fetchCommunityGoals();
      await fetchExpenses();
      await updateUserBalance();
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to contribute to community goal',
      };
    }
  };

  const createCommunityGoal = async (goalData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/community', goalData);
      setCommunityGoals([response.data, ...communityGoals]);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create community goal',
      };
    }
  };

  const updateIncome = async (id, incomeData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/income/${id}`, incomeData);
      setIncomes(incomes.map(income => income._id === id ? response.data : income));
      await updateUserBalance();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update income',
      };
    }
  };

  const updateExpense = async (id, expenseData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/expenses/${id}`, expenseData);
      setExpenses(expenses.map(expense => expense._id === id ? response.data : expense));
      await updateUserBalance();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update expense',
      };
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/income/${id}`);
      setIncomes(incomes.filter(income => income._id !== id));
      await updateUserBalance();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete income',
      };
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses(expenses.filter(expense => expense._id !== id));
      await updateUserBalance();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete expense',
      };
    }
  };

  const deleteGoal = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/goals/${id}`);
      setGoals(goals.filter(goal => goal._id !== id));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete goal',
      };
    }
  };

  const value = {
    incomes,
    expenses,
    goals,
    communityGoals,
    isLoading,
    addIncome,
    addExpense,
    addGoal,
    contributeToGoal,
    contributeToCommunityGoal,
    createCommunityGoal,
    updateIncome,
    updateExpense,
    deleteIncome,
    deleteExpense,
    deleteGoal,
    fetchAllData,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};