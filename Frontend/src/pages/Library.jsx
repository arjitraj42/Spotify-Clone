import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus } from 'lucide-react';
import axios from 'axios';
import useStore from '../store/useStore';
import './Home.css'; // Reuse Home CSS for grid layouts

export default function Library() {
  const [myAlbums, setMyAlbums] = useState([]);
  const [myMusic, setMyMusic] = useState([]);
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [likedMusic, setLikedMusic] = useState([]);
  const [likedAlbums, setLikedAlbums] = useState([]);
  const navigate = useNavigate();
  
  const { user, isAuthenticated, setCurrentTrack, setIsPlaying, likedMusicIds, likedAlbumIds, setCreatePlaylistModalOpen } = useStore();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchMyLibrary = async () => {
      try {
        const albumResponse = await axios.get('/api/music/album');
        const filteredAlbums = albumResponse.data.albums
          .filter(album => album.artist?._id === user._id || album.artist?.username === user.username)
          .map((album) => ({
            _id: album._id,
            name: album.title,
            artist: album.artist?.username || 'Unknown Artist',
            coverUrl: `https://picsum.photos/seed/${album._id}/300/300`
          }));
        setMyAlbums(filteredAlbums);

        const musicResponse = await axios.get('/api/music/');
        const filteredMusic = musicResponse.data.music
          .filter(m => m.artist?._id === user._id || m.artist?.username === user.username)
          .map((m) => ({
            ...m,
            coverUrl: `https://picsum.photos/seed/${m._id}/300/300`
          }));
        setMyMusic(filteredMusic);

        const playlistRes = await axios.get('/api/playlist/my');
        setMyPlaylists(playlistRes.data.playlists);

        const likesRes = await axios.get('/api/user/likes');
        setLikedMusic(likesRes.data.likedMusic.map(m => ({
          ...m, coverUrl: `https://picsum.photos/seed/${m._id}/300/300`
        })));
        setLikedAlbums(likesRes.data.likedAlbums.map(a => ({
          ...a, coverUrl: `https://picsum.photos/seed/${a._id}/300/300`, name: a.title, artist: a.artist?.username || 'Unknown Artist'
        })));

      } catch (err) {
        console.error('Failed to fetch library data', err);
      }
    };
    
    fetchMyLibrary();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="home-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <h2>Your Library</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Please log in to view your library.</p>
      </div>
    );
  }

  return (
    <div className="home-page animate-fade-in">
      <div className="greeting">
        <h2>Your Library</h2>
      </div>

      <div className="section-title" style={{ marginTop: '32px' }}>
        <h3>Liked Songs</h3>
      </div>

      {likedMusic.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', margin: '16px 0' }}>You haven't liked any music yet.</p>
      ) : (
        <div className="grid-cards-large">
          {likedMusic.map((track) => (
            <div 
              className="card-large glass-panel" 
              key={`liked-track-${track._id}`} 
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
      )}

      <div className="section-title" style={{ marginTop: '32px' }}>
        <h3>Liked Albums</h3>
      </div>

      {likedAlbums.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', margin: '16px 0' }}>You haven't liked any albums yet.</p>
      ) : (
        <div className="grid-cards-large">
          {likedAlbums.map((album) => (
            <div className="card-large glass-panel" key={`liked-album-${album._id}`} onClick={() => navigate(`/album/${album._id}`)}>
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
      )}

      <div className="section-title" style={{ marginTop: '32px' }}>
        <h3>Your Uploaded Tracks</h3>
      </div>

      {myMusic.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', margin: '16px 0' }}>You haven't uploaded any music yet.</p>
      ) : (
        <div className="grid-cards-large">
          {myMusic.map((track) => (
            <div 
              className="card-large glass-panel" 
              key={`lib-track-${track._id}`} 
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
      )}

      <div className="section-title" style={{ marginTop: '32px' }}>
        <h3>Your Created Albums</h3>
      </div>

      {myAlbums.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', margin: '16px 0' }}>You haven't created any albums yet.</p>
      ) : (
        <div className="grid-cards-large">
          {myAlbums.map((album) => (
            <div className="card-large glass-panel" key={`lib-album-${album._id}`} onClick={() => navigate(`/album/${album._id}`)}>
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
      )}

      <div className="section-title" style={{ marginTop: '32px' }}>
        <h3>Your Playlists</h3>
        <button 
          className="btn-secondary" 
          onClick={() => setCreatePlaylistModalOpen(true)}
          style={{ padding: '8px 16px', borderRadius: '500px', cursor: 'pointer' }}
        >
          <Plus size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }}/> Create Playlist
        </button>
      </div>

      {(!myPlaylists || myPlaylists.length === 0) ? (
        <p style={{ color: 'var(--text-muted)', margin: '16px 0' }}>You don't have any playlists.</p>
      ) : (
        <div className="grid-cards-large">
          {myPlaylists.map((playlist) => (
            <div className="card-large glass-panel" key={`playlist-${playlist._id}`} onClick={() => navigate(`/playlist/${playlist._id}`)}>
              <div className="img-container">
                 <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <span style={{ fontSize: '32px', color: '#000', fontWeight: 'bold' }}>{playlist.title[0]}</span>
                 </div>
              </div>
              <h4>{playlist.title}</h4>
              <p className="artist-desc">{playlist.music?.length || 0} tracks</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
