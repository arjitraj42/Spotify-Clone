import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import useStore from './store/useStore';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Player from './components/Player';
import Home from './pages/Home';
import Library from './pages/Library';
import AlbumView from './pages/AlbumView';
import PlaylistView from './pages/PlaylistView';
import ArtistDashboard from './pages/ArtistDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

import PlaylistModals from './components/PlaylistModals';

function AppContent() {
  const location = useLocation();
  const { isAuthenticated, setUser, setLikedMusicIds, setLikedAlbumIds, setMyPlaylists } = useStore();
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    // Check if we are already logged in via cookie on initial load
    axios.get('/api/auth/me').then(res => {
      if (res.data.user) {
        setUser(res.data.user);
      }
    }).catch(err => {
      // Not logged in or expired token
      if (err.response?.status !== 401 && err.response?.status !== 404) {
        console.error("Auth check failed", err);
      }
    });
  }, [setUser]);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get('/api/user/likes').then(res => {
        setLikedMusicIds(res.data.likedMusic.map(m => typeof m === 'object' ? m._id : m));
        setLikedAlbumIds(res.data.likedAlbums.map(a => typeof a === 'object' ? a._id : a));
      }).catch(err => console.error("Failed to fetch likes", err));

      axios.get('/api/playlist/my').then(res => {
        setMyPlaylists(res.data.playlists);
      }).catch(err => console.error("Failed to fetch playlists", err));
    }
  }, [isAuthenticated, setLikedMusicIds, setLikedAlbumIds, setMyPlaylists]);

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-view glass-panel">
        <Topbar />
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/album/:albumId" element={<AlbumView />} />
            <Route path="/playlist/:playlistId" element={<PlaylistView />} />
            <Route path="/artist/dashboard" element={<ArtistDashboard />} />
          </Routes>
        </div>
      </div>
      <Player />
      <PlaylistModals />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
