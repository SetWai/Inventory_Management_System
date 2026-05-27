import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import API from '../api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function InventoryChart() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    API.get('products/').then(res => {
      const products = res.data.results || [];
      setChartData({
        labels: products.map(p => p.name), 
        datasets: [
          {
            label: 'Current Stock Level',
            data: products.map(p => p.quantity), 
            backgroundColor: products.map(p => p.is_low_stock ? 'rgba(255, 99, 132, 0.6)' : 'rgba(75, 192, 192, 0.6)'),
            borderColor: products.map(p => p.is_low_stock ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)'),
            borderWidth: 1,
          },
        ],
      });
    }).catch(err => {
      console.error("Error fetching data for chart:", err);
    });
  }, []);

  return (
    <div className="card shadow-sm p-4 mb-4">
      <h5>Stock Levels Overview</h5>
      <div style={{ height: '300px' }}>
        <Bar 
          data={chartData} 
          options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } }
          }} 
        />
      </div>
    </div>
  );
}

export default InventoryChart;