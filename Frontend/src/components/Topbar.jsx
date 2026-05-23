import React from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useStore from '../store/useStore';
import './Topbar.css';

export default function Topbar() {
  const { isAuthenticated, logout } = useStore();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await axios.post('https://spotify-clone-mz14.onrender.com/api/auth/logout');
      logout();
      setIsLogoutModalOpen(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <>
      <div className="topbar">
        <div className="topbar-nav">
          <button className="nav-arrow"><ChevronLeft size={24} /></button>
          <button className="nav-arrow"><ChevronRight size={24} /></button>
        </div>

        <div className="topbar-actions">
          {isAuthenticated ? (
            <>
              <button className="btn-secondary">Explore Premium</button>
              <button className="user-profile-btn" onClick={() => setIsLogoutModalOpen(true)}>
                <User size={20} />
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="nav-link">Sign up</Link>
              <Link to="/login" className="btn-primary" style={{ padding: '12px 32px' }}>Log in</Link>
            </>
          )}
        </div>
      </div>

      {isLogoutModalOpen && (
        <div className="modal-overlay animate-fade-in" style={{ zIndex: 10000 }}>
          <div className="modal-content glass-panel" style={{ textAlign: 'center' }}>
            <h2>Log Out</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Are you sure you want to log out?</p>
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setIsLogoutModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleLogout} style={{ backgroundColor: '#e91429', color: 'white' }}>Log Out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
