import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import TransactionList from '../components/transactions/TransactionList';
import IncomeForm from '../components/dashboard/IncomeForm';
import ExpenseForm from '../components/dashboard/ExpenseForm';
import './Pages.css';

const Transactions = () => {
  const [activeForm, setActiveForm] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'income') {
      setActiveForm('income');
    } else if (tab === 'expense') {
      setActiveForm('expense');
    }
  }, [location]);

  const closeForm = () => {
    setActiveForm(null);
  };

  return (
    <>
      <div className="page">
        <Navbar />
        
        <div className="page-container">
          <div className="page-header">
            <div>
              <h1>Transaction History</h1>
              <p>Track all your income and expenses in one place</p>
            </div>
            <div className="header-actions">
              <button 
                className="primary-btn income-btn"
                onClick={() => setActiveForm('income')}
              >
                💰 Add Income
              </button>
              <button 
                className="primary-btn expense-btn"
                onClick={() => setActiveForm('expense')}
              >
                💸 Add Expense
              </button>
            </div>
          </div>

          <TransactionList />
        </div>
      </div>

      {activeForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeForm}>×</button>
            {activeForm === 'income' && <IncomeForm onClose={closeForm} />}
            {activeForm === 'expense' && <ExpenseForm onClose={closeForm} />}
          </div>
        </div>
      )}
    </>
  );
};

export default Transactions;