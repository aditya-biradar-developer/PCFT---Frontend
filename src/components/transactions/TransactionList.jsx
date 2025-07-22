import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import IncomeForm from '../dashboard/IncomeForm';
import ExpenseForm from '../dashboard/ExpenseForm';
import './TransactionList.css';

const TransactionList = () => {
  const { incomes, expenses, deleteIncome, deleteExpense } = useFinance();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionType, setTransactionType] = useState('all');

  // Combine and sort transactions
  const allTransactions = [
    ...incomes.map(income => ({ ...income, type: 'income' })),
    ...expenses.map(expense => ({ ...expense, type: 'expense' })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Filter transactions
  const filteredTransactions = allTransactions.filter(transaction => {
    if (transactionType === 'all') return true;
    return transaction.type === transactionType;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = async (transaction) => {
    if (window.confirm(`Are you sure you want to delete "${transaction.title}"?`)) {
      const result = transaction.type === 'income' 
        ? await deleteIncome(transaction._id)
        : await deleteExpense(transaction._id);
        
      if (result.success) {
        alert('Transaction deleted successfully');
      } else {
        alert(result.message);
      }
    }
  };

  const closeEditForm = () => {
    setEditingTransaction(null);
  };

  return (
    <>
      <div className="transaction-list">
        <div className="transaction-header">
          <h3>Transaction History</h3>
          <div className="transaction-filters">
            <select 
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="transaction-table">
            <div className="table-header">
              <div className="header-cell sl-no">Sl.No</div>
              <div className="header-cell item">Item</div>
              <div className="header-cell category">Category</div>
              <div className="header-cell amount">Amount</div>
              <div className="header-cell date">Date</div>
              <div className="header-cell actions">Actions</div>
            </div>

            {filteredTransactions.map((transaction, index) => (
              <div key={transaction._id} className="table-row">
                <div className="table-cell sl-no">{index + 1}</div>
                <div className="table-cell item">
                  <div className="item-info">
                    <span className="item-title">{transaction.title}</span>
                    {transaction.description && (
                      <span className="item-description">{transaction.description}</span>
                    )}
                  </div>
                </div>
                <div className="table-cell category">
                  <span className={`category-tag ${transaction.type}`}>
                    {transaction.category}
                  </span>
                </div>
                <div className="table-cell amount">
                  <span className={`amount-value ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
                <div className="table-cell date">
                  {formatDate(transaction.date || transaction.createdAt)}
                </div>
                <div className="table-cell actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(transaction)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(transaction)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingTransaction && (
        <div className="modal-overlay" onClick={closeEditForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeEditForm}>×</button>
            {editingTransaction.type === 'income' ? (
              <IncomeForm 
                incomeToEdit={editingTransaction} 
                onClose={closeEditForm} 
              />
            ) : (
              <ExpenseForm 
                expenseToEdit={editingTransaction} 
                onClose={closeEditForm} 
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionList;