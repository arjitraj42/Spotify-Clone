import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Clock, Heart, Minus } from 'lucide-react';
import axios from 'axios';
import useStore from '../store/useStore';
import './AlbumView.css'; // Reuse Album CSS

export default function PlaylistView() {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [availableMusic, setAvailableMusic] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying, likedMusicIds, setLikedMusicIds } = useStore();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get('/api/playlist/my');
        const found = response.data.playlists.find(p => p._id === playlistId);
        if (found) {
          setPlaylist(found);
        } else {
          navigate('/library');
        }
      } catch (err) {
        console.error('Failed to fetch playlist', err);
      }
    };
    fetchPlaylist();
  }, [playlistId, navigate]);

  const handlePlayTrack = (track) => {
    if (currentTrack?._id === track._id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack({
        _id: track._id,
        title: track.title,
        uri: track.uri,
        artist: track.artist?.username || 'Unknown Artist',
        coverUrl: track.coverUrl || `https://picsum.photos/seed/${track._id}/300/300`
      });
      setIsPlaying(true);
    }
  };

  const toggleLikeTrack = async (e, trackId) => {
    e.stopPropagation();
    try {
      const response = await axios.post(`/api/user/like/music/${trackId}`);
      setLikedMusicIds(response.data.likedMusic);
    } catch (err) {
      console.error("Failed to like track", err);
    }
  };

  const removeFromPlaylist = async (e, trackId) => {
    e.stopPropagation();
    try {
      const response = await axios.post(`/api/playlist/${playlistId}/remove`, { musicId: trackId });
      // Update local state to remove the track
      setPlaylist(prev => ({
        ...prev,
        music: prev.music.filter(m => m._id !== trackId)
      }));
    } catch (err) {
      console.error("Failed to remove track", err);
    }
  };

  const fetchAvailableMusic = async () => {
    try {
      const res = await axios.get('/api/music/');
      setAvailableMusic(res.data.music);
      setIsAdding(true);
    } catch (err) {
      console.error("Failed to fetch available music", err);
    }
  };

  const addToPlaylist = async (trackId) => {
    try {
      const response = await axios.post(`/api/playlist/${playlistId}/add`, { musicId: trackId });
      // Update local state
      const trackToAdd = availableMusic.find(m => m._id === trackId);
      if (trackToAdd && !playlist.music.some(m => m._id === trackId)) {
        setPlaylist(prev => ({
          ...prev,
          music: [...prev.music, trackToAdd]
        }));
      }
    } catch (err) {
      console.error("Failed to add track", err);
    }
  };

  if (!playlist) return <div className="album-view animate-fade-in"><div className="tracks-container"><p>Loading playlist...</p></div></div>;

  return (
    <div className="album-view animate-fade-in">
      <div className="album-header">
        <div className="album-cover shadow-glow" style={{ backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '80px', color: '#000', fontWeight: 'bold' }}>{playlist.title[0]}</span>
        </div>
        <div className="album-info">
          <span className="album-type">Playlist</span>
          <h1 className="album-title">{playlist.title}</h1>
          <p className="album-artist">
            <span style={{color: 'var(--text-main)', fontWeight: 'bold'}}>You</span> • {playlist.music?.length || 0} tracks
          </p>
        </div>
      </div>

      <div className="album-actions" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div className="play-btn-huge shadow-glow" onClick={() => playlist.music?.length > 0 && handlePlayTrack(playlist.music[0])}>
           <Play fill="#000" size={28} className="play-icon-fix" />
        </div>
        <button 
          className="btn-secondary" 
          onClick={fetchAvailableMusic}
          style={{ padding: '8px 24px', borderRadius: '500px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Add Music
        </button>
      </div>

      <div className="tracks-container">
        <div className="tracks-header">
          <div className="col-num">#</div>
          <div className="col-title">Title</div>
          <div className="col-time"><Clock size={16} /></div>
        </div>

        <div className="tracks-list">
          {playlist.music?.map((track, index) => {
            const isCurrentTrack = currentTrack?._id === track._id;
            
            return (
              <div 
                className={`track-row ${isCurrentTrack ? 'active' : ''}`} 
                key={track._id}
                onClick={() => handlePlayTrack(track)}
              >
                <div className="col-num">
                  {isCurrentTrack && isPlaying ? (
                    <img src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif" alt="playing" width="14" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                  <div className="play-icon">
                    {isCurrentTrack && isPlaying ? <Pause fill="#fff" size={16} /> : <Play fill="#fff" size={16} />}
                  </div>
                </div>
                <div className="col-title">
                  <div className="track-info">
                    <span className={`track-name ${isCurrentTrack ? 'text-primary' : ''}`}>{track.title}</span>
                    <span className="track-artist">{track.artist?.username || 'Unknown Artist'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ cursor: 'pointer' }} onClick={(e) => toggleLikeTrack(e, track._id)}>
                    <Heart size={18} fill={likedMusicIds.includes(track._id) ? "var(--primary)" : "none"} color={likedMusicIds.includes(track._id) ? "var(--primary)" : "var(--text-muted)"} />
                  </div>
                  <div style={{ cursor: 'pointer' }} onClick={(e) => removeFromPlaylist(e, track._id)}>
                    <Minus size={18} color="var(--text-muted)" />
                  </div>
                </div>
                <div className="col-time">3:00</div>
              </div>
            );
          })}
          
          {(!playlist.music || playlist.music.length === 0) && (
            <p style={{ color: 'var(--text-muted)', marginTop: '32px', textAlign: 'center' }}>This playlist is empty.</p>
          )}
        </div>

        {isAdding && (
          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Let's find something for your playlist</h2>
              <button className="btn-secondary" onClick={() => setIsAdding(false)}>Close</button>
            </div>
            <div className="tracks-list">
              {availableMusic.map((track) => {
                const isAlreadyInPlaylist = playlist.music?.some(m => m._id === track._id);
                return (
                  <div className="track-row" key={`add-${track._id}`}>
                    <div className="col-num">
                      <img src={track.coverUrl || `https://picsum.photos/seed/${track._id}/300/300`} alt="cover" style={{ width: '40px', height: '40px', borderRadius: '4px' }} />
                    </div>
                    <div className="col-title">
                      <div className="track-info">
                        <span className="track-name">{track.title}</span>
                        <span className="track-artist">{track.artist?.username || 'Unknown Artist'}</span>
                      </div>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                      {isAlreadyInPlaylist ? (
                        <button className="btn-secondary" style={{ opacity: 0.5, cursor: 'default' }} disabled>Added</button>
                      ) : (
                        <button className="btn-secondary" onClick={() => addToPlaylist(track._id)}>Add</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
