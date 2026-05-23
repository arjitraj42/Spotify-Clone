import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import axios from 'axios';
import useStore from '../store/useStore';
import './Home.css';

export default function Home() {
  const [albums, setAlbums] = useState([]);
  const [suggestedMusic, setSuggestedMusic] = useState([]);
  const navigate = useNavigate();
  
  const { isAuthenticated, setCurrentTrack, setIsPlaying } = useStore();

  useEffect(() => {
    if (!isAuthenticated) return; // Don't fetch if not logged in

    const fetchAlbumsAndMusic = async () => {
      try {
        const albumResponse = await axios.get('https://spotify-clone-mz14.onrender.com/api/music/album');
        const fetchedAlbums = albumResponse.data.albums.map((album) => ({
          _id: album._id,
          name: album.title,
          artist: album.artist?.username || 'Unknown Artist',
          coverUrl: `https://picsum.photos/seed/${album._id}/300/300`
        }));
        setAlbums(fetchedAlbums);

        const musicResponse = await axios.get('https://spotify-clone-mz14.onrender.com/api/music/');
        const fetchedMusic = musicResponse.data.music.map((m) => ({
          ...m,
          coverUrl: `https://picsum.photos/seed/${m._id}/300/300` // Use deterministic image
        }));
        setSuggestedMusic(fetchedMusic);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };
    
    fetchAlbumsAndMusic();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="home-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <h2>Welcome to Spotify Clone</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Please log in to listen to music and see albums.</p>
      </div>
    );
  }

  return (
    <div className="home-page animate-fade-in">
      <div className="greeting">
        <h2>Good Afternoon</h2>
      </div>

      <div className="grid-cards-small">
        {albums.slice(0, 6).map((album) => (
          <div className="card-small glass-panel" key={album._id} onClick={() => navigate(`/album/${album._id}`)}>
            <img src={album.coverUrl} alt={album.name} />
            <h4>{album.name}</h4>
            <div className="play-btn-small shadow-glow">
              <Play fill="#000" size={16} className="play-icon-fix" />
            </div>
          </div>
        ))}
      </div>

      <div className="section-title">
        <h3>Made For You</h3>
        <span className="see-all">Show all</span>
      </div>

      <div className="grid-cards-large">
        {albums.map((album) => (
          <div className="card-large glass-panel" key={`large-${album._id}`} onClick={() => navigate(`/album/${album._id}`)}>
            <div className="img-container">
               <img src={album.coverUrl} alt={album.name} />
               <div className="play-btn-large shadow-glow">
                 <Play fill="#000" size={20} className="play-icon-fix" />
               </div>
            </div>
            <h4>{album.name}</h4>
            <p className="artist-desc">{album.artist}</p>
          </div>
        ))}
      </div>

      {suggestedMusic.length > 0 && (
        <>
          <div className="section-title" style={{ marginTop: '32px' }}>
            <h3>Suggested Tracks</h3>
            <span className="see-all">Show all</span>
          </div>

          <div className="grid-cards-large">
            {suggestedMusic.map((track) => (
              <div 
                className="card-large glass-panel" 
                key={`track-${track._id}`} 
                onClick={() => {
                  setCurrentTrack({
                    _id: track._id,
                    title: track.title,
                    uri: track.uri,
                    artist: track.artist?.username || 'Unknown Artist',
                    coverUrl: track.coverUrl
                  });
                  setIsPlaying(true);
                }}
              >
                <div className="img-container">
                   <img src={track.coverUrl} alt={track.title} style={{ borderRadius: '50%' }} />
                   <div className="play-btn-large shadow-glow">
                     <Play fill="#000" size={20} className="play-icon-fix" />
                   </div>
                </div>
                <h4>{track.title}</h4>
                <p className="artist-desc">{track.artist?.username || 'Unknown Artist'}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
