import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import axios from 'axios';
import useStore from '../store/useStore';
import './Auth.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useStore();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError('Please fill in all fields');
      return;
    }
    setError('');

    try {
      const response = await axios.post('/api/auth/register', {
        username: name,
        email,
        password,
        role
      });
      
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <Heart fill="#1ed760" color="#1ed760" size={48} className="mb-4" />
          <h1 className="text-gradient">Sign up for free to start listening.</h1>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label>What's your email?</label>
            <input 
              type="email" 
              placeholder="Enter your email." 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
          </div>
          
          <div className="form-group">
            <label>Create a password</label>
            <input 
              type="password" 
              placeholder="Create a password." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <label>What should we call you?</label>
            <input 
              type="text" 
              placeholder="Enter a profile name." 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <label>Join as:</label>
            <div className="role-selector" style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'normal' }}>
                <input 
                  type="radio" 
                  value="user" 
                  checked={role === 'user'} 
                  onChange={(e) => setRole(e.target.value)} 
                />
                Listener
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'normal' }}>
                <input 
                  type="radio" 
                  value="artist" 
                  checked={role === 'artist'} 
                  onChange={(e) => setRole(e.target.value)} 
                />
                Artist
              </label>
            </div>
          </div>

          <button type="submit" className="btn-primary auth-submit">Sign Up</button>
        </form>

        <div className="auth-divider">
          <hr />
          <span>OR</span>
          <hr />
        </div>

        <p className="auth-redirect">
          Already have an account? <Link to="/login">Log in here</Link>
        </p>
      </div>
    </div>
  );
}
