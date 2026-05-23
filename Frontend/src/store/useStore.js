import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
  
  currentTrack: null,
  isPlaying: false,
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),

  likedMusicIds: [],
  likedAlbumIds: [],
  setLikedMusicIds: (ids) => set({ likedMusicIds: ids }),
  setLikedAlbumIds: (ids) => set({ likedAlbumIds: ids }),

  myPlaylists: [],
  setMyPlaylists: (myPlaylists) => set({ myPlaylists }),

  isCreatePlaylistModalOpen: false,
  setCreatePlaylistModalOpen: (isOpen) => set({ isCreatePlaylistModalOpen: isOpen }),
  
  trackToAdd: null,
  setTrackToAdd: (trackId) => set({ trackToAdd: trackId }),
}));

export default useStore;
