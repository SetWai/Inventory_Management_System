import React from 'react';
import InventoryChart from './InventoryChart';
import TransactionHistory from './TransactionHistory';

function Dashboard({ isDarkMode }) {
  return (
    <div className={`card shadow-sm p-4 ${isDarkMode ? 'bg-secondary text-white' : ''}`}>
      <h2 className="mb-4">Inventory Dashboard</h2>
      
      <div className="row">
        <div className="col-12 mb-5">
          <InventoryChart />
        </div>
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Recent Stock Transactions</h5>
            </div>
            <TransactionHistory />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;