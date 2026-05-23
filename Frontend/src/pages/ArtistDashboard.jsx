import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, PlusCircle } from 'lucide-react';
import useStore from '../store/useStore';
import './ArtistDashboard.css';

export default function ArtistDashboard() {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState('upload');
  
  // Upload Music State
  const [musicTitle, setMusicTitle] = useState('');
  const [musicFile, setMusicFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  // Create Album State
  const [albumTitle, setAlbumTitle] = useState('');
  const [allMusic, setAllMusic] = useState([]);
  const [selectedMusicIds, setSelectedMusicIds] = useState([]);
  const [albumStatus, setAlbumStatus] = useState('');

  useEffect(() => {
    if (activeTab === 'album') {
      fetchMyMusic();
    }
  }, [activeTab]);

  const fetchMyMusic = async () => {
    try {
      const response = await axios.get('https://spotify-clone-mz14.onrender.com/api/music/');
      console.log('Fetched music:', response.data.music);
      console.log('Current user:', user);
      
      // Filter by username, but default to all if user.username isn't found
      const myMusic = (response.data.music || []).filter(m => {
        if (!user.username) return true; // fallback if state is missing username
        return m.artist?.username === user.username;
      });
      
      // If the filter returns nothing, maybe just show everything for testing
      setAllMusic(myMusic.length > 0 ? myMusic : (response.data.music || []));
    } catch (err) {
      console.error("Failed to fetch music", err);
    }
  };

  const handleUploadMusic = async (e) => {
    e.preventDefault();
    if (!musicTitle || !musicFile) {
      setUploadStatus('Please provide a title and a file.');
      return;
    }
    
    const formData = new FormData();
    formData.append('title', musicTitle);
    formData.append('music', musicFile);

    try {
      setUploadStatus('Uploading...');
      await axios.post('https://spotify-clone-mz14.onrender.com/api/music/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus('Music uploaded successfully!');
      setMusicTitle('');
      setMusicFile(null);
      // reset file input
      document.getElementById('music-file-input').value = "";
    } catch (err) {
      setUploadStatus('Failed to upload music.');
      console.error(err);
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!albumTitle || selectedMusicIds.length === 0) {
      setAlbumStatus('Please provide a title and select at least one track.');
      return;
    }

    try {
      setAlbumStatus('Creating album...');
      await axios.post('https://spotify-clone-mz14.onrender.com/api/music/album', {
        title: albumTitle,
        music: selectedMusicIds
      });
      setAlbumStatus('Album created successfully!');
      setAlbumTitle('');
      setSelectedMusicIds([]);
    } catch (err) {
      setAlbumStatus('Failed to create album.');
      console.error(err);
    }
  };

  const toggleMusicSelection = (id) => {
    setSelectedMusicIds(prev => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  if (!user || user.role !== 'artist') {
    return (
      <div className="artist-dashboard">
        <h2>Access Denied</h2>
        <p>You must be logged in as an artist to view this page.</p>
      </div>
    );
  }

  return (
    <div className="artist-dashboard animate-fade-in">
      <div className="dashboard-header">
        <h1>Artist Dashboard</h1>
        <p>Welcome, {user.username}. Manage your music and albums here.</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          <UploadCloud size={20} /> Upload Track
        </button>
        <button 
          className={`tab-btn ${activeTab === 'album' ? 'active' : ''}`}
          onClick={() => setActiveTab('album')}
        >
          <PlusCircle size={20} /> Create Album
        </button>
      </div>

      <div className="dashboard-content glass-panel">
        {activeTab === 'upload' && (
          <form className="dashboard-form" onSubmit={handleUploadMusic}>
            <h2>Upload a New Track</h2>
            
            {uploadStatus && <div className="status-msg">{uploadStatus}</div>}
            
            <div className="form-group">
              <label>Track Title</label>
              <input 
                type="text" 
                placeholder="Enter track title" 
                value={musicTitle}
                onChange={(e) => setMusicTitle(e.target.value)}
                className="dashboard-input"
              />
            </div>

            <div className="form-group">
              <label>Audio File (.mp3, .wav)</label>
              <input 
                id="music-file-input"
                type="file" 
                accept="audio/*"
                onChange={(e) => setMusicFile(e.target.files[0])}
                className="dashboard-input file-input"
              />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>Upload</button>
          </form>
        )}

        {activeTab === 'album' && (
          <form className="dashboard-form" onSubmit={handleCreateAlbum}>
            <h2>Create a New Album</h2>
            
            {albumStatus && <div className="status-msg">{albumStatus}</div>}
            
            <div className="form-group">
              <label>Album Title</label>
              <input 
                type="text" 
                placeholder="Enter album title" 
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                className="dashboard-input"
              />
            </div>

            <div className="form-group">
              <label>Select Tracks</label>
              {allMusic.length === 0 ? (
                <p className="no-music-msg">You haven't uploaded any tracks yet.</p>
              ) : (
                <div className="music-selection-list">
                  {allMusic.map(track => (
                    <div 
                      key={track._id} 
                      className={`music-select-item ${selectedMusicIds.includes(track._id) ? 'selected' : ''}`}
                      onClick={() => toggleMusicSelection(track._id)}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedMusicIds.includes(track._id)}
                        onChange={() => {}} // Handle via parent onClick
                      />
                      <span>{track.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>Create Album</button>
          </form>
        )}
      </div>
    </div>
  );
}
