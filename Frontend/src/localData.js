export const localAlbums = [
  { _id: 'local_album_1', title: 'Kedarnath', artist: { username: 'Arijit Singh' }, coverUrl: 'https://picsum.photos/seed/kedarnath/300/300' },
  { _id: 'local_album_2', title: 'Saiyaara', artist: { username: 'Jubin Nautiyal' }, coverUrl: 'https://picsum.photos/seed/saiyaara/300/300' },
  { _id: 'local_album_3', title: 'Aiyaary', artist: { username: 'Sunidhi Chauhan' }, coverUrl: 'https://picsum.photos/seed/aiyaary/300/300' }
];

export const localMusic = [
  {
    _id: 'local_song_1',
    title: "Jaan 'Nisaar",
    artist: { username: 'Arijit Singh' },
    coverUrl: 'https://picsum.photos/seed/kedarnath/300/300',
    uri: '/Jaan ‘Nisaar (Arijit) - Kedarnath (320 kbps).mp3',
    albumId: 'local_album_1'
  },
  {
    _id: 'local_song_2',
    title: 'Barbaad Song',
    artist: { username: 'Jubin Nautiyal' },
    coverUrl: 'https://picsum.photos/seed/saiyaara/300/300',
    uri: '/Barbaad Song _ Saiyaara _ Ahaan Panday, Aneet Padda _ The Rish _ Jubin Nautiyal.mp3',
    albumId: 'local_album_2'
  },
  {
    _id: 'local_song_3',
    title: 'Lae Dooba',
    artist: { username: 'Sunidhi Chauhan' },
    coverUrl: 'https://picsum.photos/seed/aiyaary/300/300',
    uri: '/Lae Dooba - Full Video _ Aiyaary _ Sidharth Malhotra, Rakul Preet _ Sunidhi Chauhan _ Rochak Kohli.mp3',
    albumId: 'local_album_3'
  }
];
