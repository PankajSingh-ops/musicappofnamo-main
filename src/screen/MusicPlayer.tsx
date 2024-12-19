import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
  State,
  useTrackPlayerProgress,
} from 'react-native-track-player';
import {setupPlayer, tracks} from '../components/TrackPlayer';
import {PlayerControls} from '../components/PlayerControl';
import {ProgressBar} from '../components/ProgressBar';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let mounted = true;

    const setupAndLoadTracks = async () => {
      try {
        await setupPlayer();
        if (mounted) {
          await TrackPlayer.add(tracks);
        }
      } catch (error) {
        console.error('Error setting up player:', error);
      }
    };

    setupAndLoadTracks();

    return () => {
      mounted = false;
      // Proper cleanup
      const cleanup = async () => {
        try {
          await TrackPlayer.reset();
          await TrackPlayer.stop();
        } catch (error) {
          console.error('Error cleaning up player:', error);
        }
      };
      cleanup();
    };
  }, []);

  useTrackPlayerEvents([Event.PlaybackState], async event => {
    if (event.state === State.Playing) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  });

  const togglePlayback = async () => {
    try {
      const currentTrack = await TrackPlayer.getCurrentTrack();
      if (currentTrack === null) {
        await TrackPlayer.play();
      } else {
        if (isPlaying) {
          await TrackPlayer.pause();
        } else {
          await TrackPlayer.play();
        }
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const skipToNext = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.error('Error skipping to next:', error);
    }
  };

  const skipToPrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (error) {
      console.error('Error skipping to previous:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.playerContainer}>
        <Text style={styles.title}>Music Player</Text>
        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={togglePlayback}
          onNext={skipToNext}
          onPrevious={skipToPrevious}
        />
        <ProgressBar />
      </View>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  playerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
});

export default MusicPlayer;