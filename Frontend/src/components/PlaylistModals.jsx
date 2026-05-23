import React, { useState } from 'react';
import axios from 'axios';
import useStore from '../store/useStore';
import { X } from 'lucide-react';
import './PlaylistModals.css';

export default function PlaylistModals() {
  const { 
    isCreatePlaylistModalOpen, setCreatePlaylistModalOpen, 
    trackToAdd, setTrackToAdd,
    myPlaylists, setMyPlaylists
  } = useStore();
  
  const [newTitle, setNewTitle] = useState('');

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      await axios.post('/api/playlist/create', { title: newTitle });
      const playlistRes = await axios.get('/api/playlist/my');
      setMyPlaylists(playlistRes.data.playlists);
      setCreatePlaylistModalOpen(false);
      setNewTitle('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await axios.post(`/api/playlist/${playlistId}/add`, { musicId: trackToAdd });
      setTrackToAdd(null);
    } catch (err) {
      console.error("Failed to add to playlist", err);
    }
  };

  return (
    <>
      {isCreatePlaylistModalOpen && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content glass-panel">
            <button className="close-btn" onClick={() => setCreatePlaylistModalOpen(false)}><X size={20}/></button>
            <h2>Create Playlist</h2>
            <input 
              type="text" 
              placeholder="My Awesome Playlist"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="modal-input"
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setCreatePlaylistModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}

      {trackToAdd && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content glass-panel">
            <button className="close-btn" onClick={() => setTrackToAdd(null)}><X size={20}/></button>
            <h2>Add to Playlist</h2>
            {(!myPlaylists || myPlaylists.length === 0) ? (
              <p style={{ color: 'var(--text-muted)' }}>You don't have any playlists yet.</p>
            ) : (
              <div className="playlist-selection-list">
                {myPlaylists.map(playlist => (
                  <div 
                    key={playlist._id} 
                    className="playlist-selection-item"
                    onClick={() => handleAddToPlaylist(playlist._id)}
                  >
                    <div className="img-placeholder">{playlist.title[0]}</div>
                    <div className="info">
                      <h4>{playlist.title}</h4>
                      <p>{playlist.music?.length || 0} tracks</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
