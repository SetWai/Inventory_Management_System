import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';


function Login({ setToken }) { // App.js မှ setToken ကို လက်ခံရယူပါမယ်
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); // 🌟 Password ပြ/ဝှက် စစ်မည့် State
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('expired') === 'true') {
      alert("Your session has expired. Please login again!");
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('token/', credentials);
      localStorage.setItem('token', res.data.access);
      
      // အရေးကြီးဆုံးအပိုင်း - ဟာ့ဒ်ရီဖရက်ရှ် မလုပ်တော့ဘဲ State ကို တန်းပြောင်းပြီး Router နဲ့ သွားပါမယ်
      setToken(res.data.access); 
      navigate('/'); 
    } catch (err) {
      alert("Wrong username or password! Please try again.");
    }
  };

  // 🌟 Password ပြ/ဝှက် လုပ်ဆောင်မည့် function
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto shadow" style={{ maxWidth: '400px' }}>
        <h3 className="text-center">Inventory Login</h3>
        <form onSubmit={handleLogin}>
          
          {/* Username Input Field */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label visually-hidden">Username</label>
            <input 
              type="text" 
              id="username"
              name="username"
              autoComplete="username" // 🌟 ဒါလေး ထည့်ပေးပါ
              className="form-control" 
              placeholder="Username" 
              onChange={(e) => setCredentials({...credentials, username: e.target.value})} 
              required 
            />
          </div>

          {/* Password Input Field with Eye Icon */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label visually-hidden">Password</label>
            <div className="input-group border rounded bg-white"> {/* 🌟 Bootstrap Input Group သုံးထားပါတယ် */}
              <input 
                type={showPassword ? "text" : "password"} // 🌟 State အပေါ်မူတည်ပြီး type ပြောင်းလဲပါမည်
                id="password"
                name="password"
                autoComplete="current-password"
                className="form-control border-0 shadow-none"
                placeholder="Password" 
                onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
                required 
              />
              {/* 🌟 မျက်လုံး Icon ခလုတ် အပိုင်း */}
              <button 
                type="button" 
                className="btn border-0 shadow-none bg-transparent text-secondary"
                onClick={togglePasswordVisibility}
                style={{ zIndex: 10 }} // Bootstrap Bug ကြောင့် ပုံစံမပျက်စေရန်
              >
                {/* showPassword အပေါ်မူတည်ပြီး မျက်လုံးပုံ သို့မဟုတ် မျက်လုံးပိတ်ပုံ ပြောင်းပါမည် */}
                <i className={showPassword ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}></i>
              </button>
            </div>
          </div>

          <button className="btn btn-primary w-100">Login</button>
          <div className="text-center mt-3">
            <span className="text-muted">Don't have an account? </span>
            <Link to="/register" className="text-decoration-none">Register here</Link> {/* 🌟 ဒါလေး ထည့်ပေးပါ */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;