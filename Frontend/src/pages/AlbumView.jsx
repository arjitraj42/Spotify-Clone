import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Pause, Clock, Heart, Plus } from 'lucide-react';
import axios from 'axios';
import useStore from '../store/useStore';
import './AlbumView.css';

export default function AlbumView() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [myPlaylists, setMyPlaylists] = useState([]);
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying, likedMusicIds, setLikedMusicIds, likedAlbumIds, setLikedAlbumIds, setTrackToAdd } = useStore();

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await axios.get(`https://spotify-clone-mz14.onrender.com/api/music/album/${albumId}`);
        setAlbum(response.data.album);
        
        const playlistRes = await axios.get('https://spotify-clone-mz14.onrender.com/api/playlist/my');
        setMyPlaylists(playlistRes.data.playlists);
      } catch (err) {
        console.error('Failed to fetch album or playlists', err);
      }
    };
    fetchAlbum();
  }, [albumId]);

  if (!album) {
    return <div className="album-view loading">Loading album...</div>;
  }

  const handlePlayTrack = (track) => {
    if (currentTrack?._id === track._id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack({
        _id: track._id,
        title: track.title,
        uri: track.uri,
        artist: album.artist.username,
        coverUrl: `https://picsum.photos/seed/${album._id}/300/300`
      });
      setIsPlaying(true);
    }
  };

  const toggleLikeAlbum = async () => {
    try {
      const response = await axios.post(`https://spotify-clone-mz14.onrender.com/api/user/like/album/${album._id}`);
      setLikedAlbumIds(response.data.likedAlbums);
    } catch (err) {
      console.error("Failed to like album", err);
    }
  };

  const toggleLikeTrack = async (e, trackId) => {
    e.stopPropagation();
    try {
      const response = await axios.post(`https://spotify-clone-mz14.onrender.com/api/user/like/music/${trackId}`);
      setLikedMusicIds(response.data.likedMusic);
    } catch (err) {
      console.error("Failed to like track", err);
    }
  };

  const addToPlaylist = (e, trackId) => {
    e.stopPropagation();
    if (myPlaylists.length === 0) {
      alert("You don't have any playlists. Create one in Your Library first!");
      return;
    }
    
    setTrackToAdd(trackId);
  };

  const isAlbumLiked = likedAlbumIds.includes(album._id);

  return (
    <div className="album-view animate-fade-in">
      <div className="album-header">
        <img 
          src={`https://picsum.photos/seed/${album._id}/300/300`} 
          alt={album.title} 
          className="album-cover-large shadow-glow" 
        />
        <div className="album-details">
          <span className="album-type">Album</span>
          <h1 className="album-title">{album.title}</h1>
          <div className="album-meta">
            <span className="artist-name-bold">{album.artist?.username || 'Unknown Artist'}</span>
            <span className="bullet-point">•</span>
            <span>{album.music?.length || 0} songs</span>
          </div>
        </div>
      </div>

      <div className="album-actions">
        <div className="play-btn-huge shadow-glow" onClick={() => album.music?.length > 0 && handlePlayTrack(album.music[0])}>
           <Play fill="#000" size={28} className="play-icon-fix" />
        </div>
        <div style={{ marginLeft: '24px', cursor: 'pointer' }} onClick={toggleLikeAlbum}>
          <Heart size={32} fill={isAlbumLiked ? "var(--primary)" : "none"} color={isAlbumLiked ? "var(--primary)" : "var(--text-muted)"} />
        </div>
      </div>

      <div className="tracks-container">
        <div className="tracks-header">
          <div className="col-hashtag">#</div>
          <div className="col-title">Title</div>
          <div className="col-time"><Clock size={16} /></div>
        </div>
        <div className="divider"></div>

        <div className="tracks-list">
          {album.music?.map((track, index) => {
            const isCurrentTrack = currentTrack?._id === track._id;
            return (
              <div 
                className={`track-row ${isCurrentTrack ? 'active-track' : ''}`} 
                key={track._id}
                onClick={() => handlePlayTrack(track)}
              >
                <div className="col-hashtag">
                  {isCurrentTrack && isPlaying ? (
                    <div className="playing-bars">
                      <div className="bar bar1"></div>
                      <div className="bar bar2"></div>
                      <div className="bar bar3"></div>
                    </div>
                  ) : (
                    <span className="track-index">{index + 1}</span>
                  )}
                  <Play size={16} fill="#fff" className="track-play-icon" />
                </div>
                <div className="col-title">
                  <div className="track-info">
                    <span className={`track-name ${isCurrentTrack ? 'text-primary' : ''}`}>{track.title}</span>
                    <span className="track-artist">{album.artist?.username || 'Unknown Artist'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ cursor: 'pointer' }} onClick={(e) => toggleLikeTrack(e, track._id)}>
                    <Heart size={18} fill={likedMusicIds.includes(track._id) ? "var(--primary)" : "none"} color={likedMusicIds.includes(track._id) ? "var(--primary)" : "var(--text-muted)"} />
                  </div>
                  <div style={{ cursor: 'pointer' }} onClick={(e) => addToPlaylist(e, track._id)}>
                    <Plus size={18} color="var(--text-muted)" />
                  </div>
                </div>
                <div className="col-time">3:00</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
