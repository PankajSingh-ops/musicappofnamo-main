import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalPlayer from '../Music Player/GlobalPlayer';
import TrackItem from '../Music Player/TrackItem';
import { Track } from '../../type';
import { useMusicPlayer } from '../Music Player/MusicContext';
import { useAuth } from '../../asyncStorage/AsyncStorage';

const FavoritesScreen: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayback,
    skipToNext,
    skipToPrevious,
  } = useMusicPlayer();

  const { token, user } = useAuth();

  // Fetch favorites
  const fetchFavorites = async () => {
    if (!token) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:3000/api/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      setFavorites(data.favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      Alert.alert('Error', 'Failed to load favorites');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchFavorites();
  }, [token]);

  const handlePlayTrack = async (track: Track) => {
    await playTrack(track, favorites);
  };

  const handleAddToFavorites = async (track: Track) => {
    if (!token) return;

    try {
      const response = await fetch('http://10.0.2.2:3000/api/favorites', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackId: track.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to favorites');
      }

      // Update local state
      setFavorites(prevFavorites => [...prevFavorites, track]);
      Alert.alert('Success', 'Track added to favorites');
    } catch (error) {
      console.error('Error adding track:', error);
      Alert.alert('Error', 'Failed to add track to favorites');
    }
  };

  const handleRemoveTrack = async (trackId: string) => {
    if (!token) return;

    try {
      const response = await fetch(`http://10.0.2.2:3000/api/favorites/${trackId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }

      // Update local state
      setFavorites(prevFavorites => 
        prevFavorites.filter(track => track.id !== trackId)
      );

      Alert.alert('Success', 'Track removed from favorites');
    } catch (error) {
      console.error('Error removing track:', error);
      Alert.alert('Error', 'Failed to remove track from favorites');
    }
  };

  const handleToggleFavorite = async () => {
    if (!currentTrack || !token) return;

    const isCurrentlyFavorite = favorites.some(track => track.id === currentTrack.id);

    if (isCurrentlyFavorite) {
      await handleRemoveTrack(currentTrack.id);
    } else {
      await handleAddToFavorites(currentTrack);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchFavorites();
  };

  const renderTrackItem = ({ item }: { item: Track }) => {
    const isCurrentlyPlaying = currentTrack?.id === item.id;

    return (
      <TrackItem
        item={item}
        onPlay={handlePlayTrack}
        isPlaying={isCurrentlyPlaying && isPlaying}
        isEditing={isEditMode}
        onRemove={handleRemoveTrack}
        isSelected={isCurrentlyPlaying}
      />
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.screenContainer, styles.centerContent]}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.screenContainer, styles.centerContent]}>
        <Icon name="lock-closed-outline" size={80} color="#888" />
        <Text style={styles.emptyText}>Please log in to view favorites</Text>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.screenTitle}>Favorites</Text>
        {favorites.length > 0 && (
          <TouchableOpacity onPress={() => setIsEditMode(!isEditMode)}>
            <Icon
              name={isEditMode ? 'close' : 'create-outline'}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={favorites}
        keyExtractor={item => item.id}
        renderItem={renderTrackItem}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#1DB954"
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="heart-outline" size={80} color="#888" />
            <Text style={styles.emptyText}>No Favorites Yet</Text>
          </View>
        )}
      />

      {currentTrack && (
        <GlobalPlayer
          currentTrack={currentTrack}
          onPlayPause={togglePlayback}
          isPlaying={isPlaying}
          onNext={skipToNext}
          onPrevious={skipToPrevious}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => {
            // Optional: Implement close behavior
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 15,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
  },
});

export default FavoritesScreen;