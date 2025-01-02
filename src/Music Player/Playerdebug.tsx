import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import TrackPlayer, { State, useTrackPlayerEvents, Event } from 'react-native-track-player';

const PlayerDebug = () => {
  const [playerState, setPlayerState] = useState<string>('unknown');
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [buffered, setBuffered] = useState<number>(0);

  useTrackPlayerEvents([Event.PlaybackState, Event.PlaybackError], async (event) => {
    if (event.type === Event.PlaybackState) {
      const state = await TrackPlayer.getState();
      setPlayerState(State[state]);
    } else if (event.type === Event.PlaybackError) {
      console.error('Playback error:', event);
    }
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const position = await TrackPlayer.getPosition();
        const buffer = await TrackPlayer.getBufferedPosition();
        setCurrentPosition(position);
        setBuffered(buffer);
      } catch (error) {
        console.error('Error getting player info:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ padding: 10, backgroundColor: '#f0f0f0' }}>
      <Text>Player State: {playerState}</Text>
      <Text>Position: {currentPosition.toFixed(2)}s</Text>
      <Text>Buffered: {buffered.toFixed(2)}s</Text>
    </View>
  );
};

export default PlayerDebug;