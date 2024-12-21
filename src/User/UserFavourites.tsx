import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TrackPlayer, { useTrackPlayerEvents, Event, State } from 'react-native-track-player';
import GlobalPlayer from '../Music Player/GlobalPlayer';
import TrackItem from '../Music Player/TrackItem';
import { favoritesData } from './data/demofavouriteData';
import { Track } from '../../type';
import { setupPlayer } from '../components/TrackPlayer';

const FavoritesScreen: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const initializePlayer = async () => {
      try {
        await setupPlayer();
        await TrackPlayer.reset();
        const tracks = favoritesData.map(track => ({
          id: track.id,
          url: track.url,
          title: track.title,
          artist: track.artist,
          artwork: track.artwork,
        }));
        await TrackPlayer.add(tracks);
      } catch (error) {
        console.error('Error initializing player:', error);
      }
    };

    initializePlayer();
  }, []);

  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    if (event.type === Event.PlaybackState) {
      const state = await TrackPlayer.getState();
      setIsPlaying(state === State.Playing);
    }
  });

  const handlePlayTrack = async (track: Track) => {
    try {
      const index = favoritesData.findIndex(t => t.id === track.id);
      await TrackPlayer.skip(index);
      setCurrentTrack(track);
      await TrackPlayer.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handleNext = async () => {
    try {
      await TrackPlayer.skipToNext();
      const trackIndex = await TrackPlayer.getCurrentTrack();
      if (trackIndex !== null) {
        setCurrentTrack(favoritesData[trackIndex]);
      }
    } catch (error) {
      console.error('Error skipping to next track:', error);
    }
  };

  const handlePrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
      const trackIndex = await TrackPlayer.getCurrentTrack();
      if (trackIndex !== null) {
        setCurrentTrack(favoritesData[trackIndex]);
      }
    } catch (error) {
      console.error('Error skipping to previous track:', error);
    }
  };

  const handleRemoveTrack = async (trackId: string) => {
    try {
      const index = favoritesData.findIndex(track => track.id === trackId);
      if (index !== -1) {
        await TrackPlayer.remove(index);
        // Here you would typically also update your favoritesData state
        console.log('Track removed:', trackId);
      }
    } catch (error) {
      console.error('Error removing track:', error);
    }
  };

  const handleToggleFavorite = () => {
    // Implement your favorite toggling logic here
    console.log('Toggle favorite');
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.screenTitle}>Favorites</Text>
        <TouchableOpacity onPress={() => setIsEditMode(!isEditMode)}>
          <Icon
            name={isEditMode ? 'close' : 'create-outline'}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={favoritesData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TrackItem
            item={item}
            onPlay={handlePlayTrack}
            isEditing={isEditMode}
            onRemove={handleRemoveTrack}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="heart-outline" size={80} color="#888" />
            <Text style={styles.emptyText}>No Favorites Yet</Text>
          </View>
        )}
      />
      <GlobalPlayer
        currentTrack={currentTrack}
        onPlayPause={handlePlayPause}
        isPlaying={isPlaying}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onToggleFavorite={handleToggleFavorite}
        onClose={() => setCurrentTrack(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  screenTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#888',
    marginTop: 20,
    fontSize: 18,
  },
});

export default FavoritesScreen;