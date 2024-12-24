import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalPlayer from '../Music Player/GlobalPlayer';
import TrackItem from '../Music Player/TrackItem';
import {favoritesData} from './data/demofavouriteData';
import {Track} from '../../type';
import {useMusicPlayer} from '../Music Player/MusicContext';

const FavoritesScreen: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayback,
    skipToNext,
    skipToPrevious,
  } = useMusicPlayer();

  const handlePlayTrack = async (track: Track) => {
    await playTrack(track, favoritesData);
  };

  const handleRemoveTrack = async (trackId: string) => {
    try {
      // Here you would typically update your favorites list in your app's state/storage
      console.log('Track removed:', trackId);
    } catch (error) {
      console.error('Error removing track:', error);
    }
  };

  const handleToggleFavorite = () => {
    // Implement your favorite toggling logic here
    console.log('Toggle favorite');
  };

  const renderTrackItem = ({item}: {item: Track}) => {
    const isCurrentlyPlaying = currentTrack?.id === item.id;

    return (
      <TrackItem
        item={item}
        onPlay={handlePlayTrack}
        isPlaying={isCurrentlyPlaying}
        isEditing={isEditMode}
        onRemove={handleRemoveTrack}
        textStyle={
          isCurrentlyPlaying ? styles.playingTrackText : styles.trackText
        }
      />
    );
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
        renderItem={renderTrackItem}
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
            /* Optional: Implement close behavior */
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
  trackText: {
    color: '#fff',
  },
  playingTrackText: {
    color: '#1DB954', // Spotify-like green color for playing track
    fontWeight: 'bold',
    backgroundColor:'red'
  },
});

export default FavoritesScreen;
