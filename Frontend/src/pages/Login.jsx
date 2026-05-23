import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import axios from 'axios';
import useStore from '../store/useStore';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    
    try {
      const response = await axios.post('/api/auth/login', {
        email: email,
        username: email,
        password
      });
      
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <Heart fill="#1ed760" color="#1ed760" size={48} className="mb-4" />
          <h1 className="text-gradient">Log in to Spotify Clone</h1>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Email address or username</label>
            <input 
              type="text" 
              placeholder="Email or username" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
          </div>

          <button type="submit" className="btn-primary auth-submit">Log In</button>
        </form>

        <div className="auth-divider">
          <hr />
          <span>OR</span>
          <hr />
        </div>

        <p className="auth-redirect">
          Don't have an account? <Link to="/register">Sign up for Spotify Clone</Link>
        </p>
      </div>
    </div>
  );
}
