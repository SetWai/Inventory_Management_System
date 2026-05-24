import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Link, Navigate, useNavigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import Dashboard from './components/Dashboard';
import AddProduct from './components/AddProduct';
import AddCategory from './components/AddCategory';
import AddTransaction from './components/AddTransaction';
import Login from './components/Login'; 
import Register from './components/Register';
import { setupNavigate } from './api';
import 'bootstrap/dist/css/bootstrap.min.css';

function NavigationInterceptor({ setToken }) {
  const navigate = useNavigate();
  useEffect(() => {
    setupNavigate(navigate, setToken); 
  }, [navigate, setToken]);
  return null;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <NavigationInterceptor setToken={setToken} />
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">Inventory</Link>
          
          <div className="d-flex align-items-center">
            {token && (
              <>
                <NavLink 
                  to="/" 
                  className={({ isActive }) => isActive ? "btn btn-primary me-2" : "btn btn-outline-light me-2"}
                >
                  Home
                </NavLink>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => isActive ? "btn btn-primary me-2" : "btn btn-outline-light me-2"}
                >
                  Dashboard
                </NavLink>
                <button className="btn btn-outline-danger ms-3" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container">
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} /> {/* 🌟 လမ်းကြောင်းအသစ် ထည့်သွင်းခြင်း */}
          {/* Protected Routes */}
          <Route path="/" element={token ? <ProductList /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/add-product" element={token ? <AddProduct /> : <Navigate to="/login" />} />
          <Route path="/add-category" element={token ? <AddCategory /> : <Navigate to="/login" />} />
          <Route path="/add-transaction" element={token ? <AddTransaction /> : <Navigate to="/login" />} />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;