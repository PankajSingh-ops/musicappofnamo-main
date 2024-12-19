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
    url: require('../../audio/audio.mp3'),
    title: 'Track 1',
    artist: 'Artist 1',
    duration: 180,
  },
  {
    id: '2',
    url: require('../../audio/music.mp3'),
    title: 'Track 2',
    artist: 'Artist 2',
    duration: 240,
  },
];
