import React, {useEffect} from 'react';
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
import {Track} from '../../type';
import {useMusicPlayer} from '../Music Player/MusicContext';
import {useAuth} from '../../asyncStorage/AsyncStorage';
import {useFavoritesStore} from '../../store/userFavouriteStpre';

const FavoritesScreen: React.FC = () => {
  const {
    favorites,
    isLoading,
    isEditMode,
    setIsEditMode,
    fetchFavorites,
    toggleFavorite,
  } = useFavoritesStore();

  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayback,
    skipToNext,
    skipToPrevious,
  } = useMusicPlayer();

  const {token, user} = useAuth();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Initial load
  useEffect(() => {
    if (token) {
      fetchFavorites(token).catch(error => {
        Alert.alert('Error', 'Failed to load favorites');
      });
    }
  }, [token]);

  const handlePlayTrack = async (track: Track) => {
    await playTrack(track, favorites);
  };

  const handleToggleFavorite = async () => {
    if (!currentTrack || !token) return;

    try {
      await toggleFavorite(currentTrack, token);
      Alert.alert('Success', 'Favorites updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchFavorites(token);
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh favorites');
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderTrackItem = ({item}: {item: Track}) => {
    const isCurrentlyPlaying = currentTrack?.id === item.id;

    return (
      <TrackItem
        item={item}
        onPlay={handlePlayTrack}
        isPlaying={isCurrentlyPlaying && isPlaying}
        isEditing={isEditMode}
        onRemove={trackId => toggleFavorite(item, token)}
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

// Styles remain the same
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
