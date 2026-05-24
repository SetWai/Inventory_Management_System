import React from 'react';
import InventoryChart from './InventoryChart';
import TransactionHistory from './TransactionHistory';

function Dashboard() {
  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">Inventory Dashboard</h2>
      
      <div className="row">
        {/* Stock Level Chart အပိုင်း */}
        <div className="col-12 mb-5">
          <InventoryChart />
        </div>
        
        {/* Recent Transactions Table အပိုင်း */}
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