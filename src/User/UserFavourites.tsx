import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalPlayer from '../Music Player/GlobalPlayer';
import TrackItem from '../Music Player/TrackItem';
import { favoritesData } from './data/demofavouriteData';
import { Track } from '../../type';

const FavoritesScreen: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRemoveTrack = (trackId: string) => {
    // Implement remove functionality
    console.log('Remove track:', trackId);
  };

  const handleNext = () => {
    // Implement next track logic
    console.log('Next track');
  };

  const handlePrevious = () => {
    // Implement previous track logic
    console.log('Previous track');
  };

  const handleToggleFavorite = () => {
    // Implement toggle favorite logic
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