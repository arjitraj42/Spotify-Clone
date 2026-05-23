import React from 'react';
import { Home, Search, Library, PlusSquare, Heart, Mic2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import axios from 'axios';
import './Sidebar.css';

export default function Sidebar() {
  const { user, myPlaylists, setMyPlaylists, setCreatePlaylistModalOpen } = useStore();
  const location = useLocation();
  return (
    <div className="sidebar">
      <div className="logo-container">
        <Link to="/" className="logo">
          <Heart fill="#1ed760" color="#1ed760" size={32} />
          <span>Spotify Clone</span>
        </Link>
      </div>
      
      <nav className="nav-links">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <Home size={24} />
          <span>Home</span>
        </Link>
        <div className="nav-item">
          <Search size={24} />
          <span>Search</span>
        </div>
        <Link to="/library" className={`nav-item ${location.pathname === '/library' ? 'active' : ''}`}>
          <Library size={24} />
          <span>Your Library</span>
        </Link>
        
        {user?.role === 'artist' && (
          <Link to="/artist/dashboard" className={`nav-item ${location.pathname === '/artist/dashboard' ? 'active' : ''}`}>
            <Mic2 size={24} />
            <span>Artist Dashboard</span>
          </Link>
        )}
      </nav>

      <div className="nav-links secondary-actions">
        <div className="nav-item" onClick={() => {
          if (!user) { alert("Please log in first!"); return; }
          setCreatePlaylistModalOpen(true);
        }} style={{ cursor: 'pointer' }}>
          <div className="icon-box create-playlist">
            <PlusSquare size={20} />
          </div>
          <span>Create Playlist</span>
        </div>
        <Link to="/library" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="icon-box liked-songs">
            <Heart size={20} fill="#fff" />
          </div>
          <span>Liked Songs</span>
        </Link>
      </div>
      
      <div className="divider"></div>
      
      <div className="playlist-scroll">
        {myPlaylists?.map(playlist => (
          <Link 
            to={`/playlist/${playlist._id}`} 
            className="playlist-item" 
            key={playlist._id}
            style={{ textDecoration: 'none', display: 'block', color: 'inherit', padding: '8px 16px', cursor: 'pointer' }}
          >
            {playlist.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
