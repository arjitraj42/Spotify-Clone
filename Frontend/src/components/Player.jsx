import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Heart } from 'lucide-react';
import axios from 'axios';
import useStore from '../store/useStore';
import './Player.css';

export default function Player() {
  const { currentTrack, isPlaying, setIsPlaying, likedMusicIds, setLikedMusicIds } = useStore();
  const audioRef = useRef(null);
  
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play error", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      audioRef.current.currentTime = percent * audioRef.current.duration;
    }
  };

  const toggleLikeTrack = async () => {
    if (!currentTrack) return;
    try {
      const response = await axios.post(`/api/user/like/music/${currentTrack._id}`);
      setLikedMusicIds(response.data.likedMusic);
    } catch (err) {
      console.error("Failed to like track", err);
    }
  };

  const isLiked = currentTrack && likedMusicIds.includes(currentTrack._id);

  return (
    <div className="player-container glass-panel">
      {/* Hidden Audio Element */}
      {currentTrack && (
        <audio 
          ref={audioRef}
          src={currentTrack.uri}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <div className="player-left">
        <div className="now-playing-img">
          {currentTrack ? (
            <img src={currentTrack.coverUrl} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div className="placeholder-art"></div>
          )}
        </div>
        <div className="now-playing-info">
          <h4 className="track-name">{currentTrack ? currentTrack.title : 'No Track Selected'}</h4>
          <p className="artist-name">{currentTrack ? currentTrack.artist : '-'}</p>
        </div>
        {currentTrack && (
          <div style={{ marginLeft: '12px', cursor: 'pointer' }} onClick={toggleLikeTrack}>
            <Heart size={20} fill={isLiked ? "#1db954" : "none"} color={isLiked ? "#1db954" : "white"} />
          </div>
        )}
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button className="control-btn"><Shuffle size={18} /></button>
          <button className="control-btn"><SkipBack size={20} /></button>
          <button className="play-btn" onClick={() => setIsPlaying(!isPlaying)} disabled={!currentTrack}>
            {isPlaying ? <Pause size={24} fill="#000" /> : <Play size={24} fill="#000" className="play-icon-fix" />}
          </button>
          <button className="control-btn"><SkipForward size={20} /></button>
          <button className="control-btn"><Repeat size={18} /></button>
        </div>
        <div className="progress-container">
          <span className="time-text">{formatTime(currentTime)}</span>
          <div className="progress-bar-wrapper" onClick={handleSeek}>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <span className="time-text">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-right">
        <Volume2 size={20} className="volume-icon" />
        <div className="volume-bar-wrapper">
          <div className="volume-bar">
             <div className="volume-fill" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
