import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';



function Login({ setToken }) { 
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('expired') === 'true') {
      Swal.fire('Your session has expired. Please login again!');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('token/', credentials);
      localStorage.setItem('token', res.data.access);
      
      setToken(res.data.access); 
      navigate('/'); 
    } catch (err) {
      Swal.fire('Wrong username or password! Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto shadow" style={{ maxWidth: '400px' }}>
        <h3 className="text-center">Inventory Login</h3>
        <form onSubmit={handleLogin}>
          
          <div className="mb-3">
            <label htmlFor="username" className="form-label visually-hidden">Username</label>
            <input 
              type="text" 
              id="username"
              name="username"
              autoComplete="username" 
              className="form-control" 
              placeholder="Username" 
              onChange={(e) => setCredentials({...credentials, username: e.target.value})} 
              required 
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label visually-hidden">Password</label>
            <div className="input-group border rounded bg-white"> 
              <input 
                type={showPassword ? "text" : "password"} 
                id="password"
                name="password"
                autoComplete="current-password"
                className="form-control border-0 shadow-none"
                placeholder="Password" 
                onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
                required 
              />
              <button 
                type="button" 
                className="btn border-0 shadow-none bg-transparent text-secondary"
                onClick={togglePasswordVisibility}
                style={{ zIndex: 10 }} 
              >
                <i className={showPassword ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}></i>
              </button>
            </div>
          </div>

          <button className="btn btn-primary w-100">Login</button>
          <div className="text-center mt-3">
            <span className="text-muted">Don't have an account? </span>
            <Link to="/register" className="text-decoration-none">Register here</Link> 
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;