import React, { useState, useEffect } from 'react';
import API from '../api';

function TransactionHistory({ isDarkMode }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    API.get('transactions/').then(res => setTransactions(res.data));
  }, []);

  return (
    <div className="table-responsive">
      <table className={`table table-hover mb-0 ${isDarkMode ? 'table-dark' : ''}`}>
        <thead className={`table-header  mb-0 ${isDarkMode ? 'table-dark' : ''}`}>
          <tr>
            <th>Date</th>
            <th>Product</th>
            <th>Type</th>
            <th>Qty</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id}>
              <td>{new Date(t.timestamp).toLocaleDateString()}</td>
              <td>{t.product_name}</td>
              <td>
                <span className={`badge ${t.transaction_type === 'IN' ? 'bg-success' : 'bg-danger'}`}>
                  {t.transaction_type === 'IN' ? 'IN' : 'OUT'}
                </span>
              </td>
              <td>{t.quantity}</td>
              <td><small className="text-muted">{t.notes}</small></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionHistory;