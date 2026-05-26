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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true' ? true : false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('bg-dark', 'text-light');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('bg-dark', 'text-light');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <NavigationInterceptor setToken={setToken} />
      <nav className={`navbar navbar-expand-lg ${isDarkMode ? 'navbar-dark bg-dark border-bottom border-secondary' : 'navbar-light bg-light border-bottom'}`}>
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">Inventory</Link>
          <div className="d-flex align-items-center gap-2 ms-auto">
            {token && (
              <>
                <NavLink 
                  to="/" 
                  className={`btn btn-sm me-2 ${isDarkMode ? 'btn-outline-light' : 'btn-outline-primary'}`}
                >
                  Home
                </NavLink>
                <NavLink 
                  to="/dashboard" 
                  className={`btn btn-sm me-2 ${isDarkMode ? 'btn-outline-light' : 'btn-outline-primary'}`}
                >
                  Dashboard
                </NavLink>
                <button className="btn btn-outline-danger ms-3" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
            <button 
              className={`btn btn-sm ${isDarkMode ? 'btn-light text-dark' : 'btn-dark text-light'} ms-2`} 
              onClick={toggleDarkMode}
              style={{ width: '120px' }} 
            >
              {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={!token ? <Login setToken={setToken} isDarkMode={isDarkMode}/> : <Navigate to="/" />} />
          <Route path="/register" element={!token ? <Register isDarkMode={isDarkMode}/> : <Navigate to="/" />} /> 
          {/* Protected Routes */}
          <Route path="/" element={token ? <ProductList isDarkMode={isDarkMode}/> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={token ? <Dashboard isDarkMode={isDarkMode}/> : <Navigate to="/login" />} />
          <Route path="/add-product" element={token ? <AddProduct isDarkMode={isDarkMode}/> : <Navigate to="/login" />} />
          <Route path="/add-category" element={token ? <AddCategory isDarkMode={isDarkMode}/> : <Navigate to="/login" />} />
          <Route path="/add-transaction" element={token ? <AddTransaction isDarkMode={isDarkMode}/> : <Navigate to="/login" />} />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;