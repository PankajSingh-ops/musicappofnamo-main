import TrackPlayer from 'react-native-track-player';

export const setupPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP,
        TrackPlayer.CAPABILITY_SEEK_TO,
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
      ],
    });
  } catch (error) {
    console.log('Error setting up player:', error);
  }
};

export const tracks = [
  {
    id: '1',
    url: require('../../audio/hindi.mp3'),
    title: 'Track 1',
    artist: 'Artist 1',
    duration: 800,
    artwork: undefined // optional: add artwork if you have it
  },
  {
    id: '2',
    url: require('../../audio/gaana.mp3'),
    title: 'Track 2',
    artist: 'Artist 2',
    duration: 800,
    artwork: undefined
  },
  {
    id: '3',
    url: require('../../audio/kk.mp3'),
    title: 'Track 3',
    artist: 'Artist 4',
    duration: 800,
    artwork: undefined
  },
];

// Add this function to test loading tracks
export const addTracks = async () => {
  try {
    await TrackPlayer.add(tracks);
    console.log('Tracks added successfully');
  } catch (error) {
    console.log('Error adding tracks:', error);
    // Log the full path to help debug
    console.log('Track paths:', {
      track1: require('../../audio/hindi.mp3'),
      track2: require('../../audio/music.mp3')
    });
  }
};
