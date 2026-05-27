import React, { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [credentials, setCredentials] = useState({ 
    username: '', 
    password: '', 
    confirmPassword: '',
    secret_code: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (credentials.password !== credentials.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await API.post('register/', {
        username: credentials.username,
        password: credentials.password,
        secret_code: credentials.secret_code 
      });
      alert("Registration Successful! Please login.");
      navigate('/login'); 
    } catch (err) {
      if (err.response && err.response.status === 429) {
        // 🌟 Rate limit မိသွားတဲ့အခါ ပြသမည့် မက်ဆေ့ခ်ျ
        alert("Too many requests! Please wait a minute before trying again.");
      } else if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error); 
      } else {
        alert("Registration failed! Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto shadow" style={{ maxWidth: '400px' }}>
        <h3 className="text-center mb-4">Create Account</h3>
        <form onSubmit={handleRegister}>
          
          {/* Username Field */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label visually-hidden">Username</label>
            <input 
              type="text" 
              id="username"
              name="username"
              autoComplete="username"
              className="form-control" 
              placeholder="Choose Username" 
              onChange={(e) => setCredentials({...credentials, username: e.target.value})} 
              required 
            />
          </div>

          <div className="mb-3">
            <label htmlFor="secretCode" className="form-label visually-hidden">Secret Invitation Code</label>
            <input 
              type="text" 
              id="secretCode"
              name="secret_code"
              autoComplete="off"
              className="form-control" 
              placeholder="Secret Invitation Code" 
              onChange={(e) => setCredentials({...credentials, secret_code: e.target.value})} 
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
                autoComplete="new-password"
                className="form-control border-0 shadow-none" 
                placeholder="Password" 
                onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
                required 
              />
              <button 
                type="button" 
                className="btn border-0 shadow-none bg-transparent text-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={showPassword ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}></i>
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label visually-hidden">Confirm Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              className="form-control" 
              placeholder="Confirm Password" 
              onChange={(e) => setCredentials({...credentials, confirmPassword: e.target.value})} 
              required 
            />
          </div>

          <button className="btn btn-success w-100 mt-2">Register</button>
          
          <div className="text-center mt-3">
            <span className="text-muted">Already have an account? </span>
            <Link to="/login" className="text-decoration-none">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;