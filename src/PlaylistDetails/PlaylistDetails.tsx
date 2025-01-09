import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useMusicPlayer } from '../Music Player/MusicContext';
import { Track } from '../../type';
import TrackItem from '../Music Player/TrackItem';
import GlobalPlayer from '../Music Player/GlobalPlayer';
import { useAuth } from '../../asyncStorage/AsyncStorage';

interface PlaylistTrack extends Track {
  addedAt: string;
}

const PlaylistDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { playlist } = route.params;
  const { token } = useAuth();
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayback,
    skipToNext,
    skipToPrevious,
  } = useMusicPlayer();

  const [tracks, setTracks] = useState<PlaylistTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPlaylistTracks = async () => {
    try {
      const response = await fetch(
        `http://10.0.2.2:3000/api/playlists/${playlist.id}/songs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch playlist tracks');

      const data = await response.json();
      setTracks(data);
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
      Alert.alert('Error', 'Failed to load playlist tracks');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPlaylistTracks();
  }, [playlist.id]);

  const handlePlayTrack = async (track: Track) => {
    await playTrack(track, tracks);
  };

  const handlePlayAll = async () => {
    if (tracks.length > 0) {
      await playTrack(tracks[0], tracks);
    }
  };

  const handleRemoveTrack = async (trackId: number) => {
    try {
      const response = await fetch(
        `http://10.0.2.2:3000/api/playlists/${playlist.id}/songs/${trackId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to remove track');

      // Update local state
      setTracks(tracks.filter(track => track.id !== trackId));
      
      // Update playlist total songs count if needed
      if (route.params?.onPlaylistUpdate) {
        route.params.onPlaylistUpdate({
          ...playlist,
          totalSongs: playlist.totalSongs - 1,
        });
      }
    } catch (error) {
      console.error('Error removing track:', error);
      Alert.alert('Error', 'Failed to remove track from playlist');
    }
  };

  const handleToggleFavorite = () => {
    // Implement favorite functionality
    console.log('Toggle favorite');
  };

  const renderTrackItem = ({ item }: { item: PlaylistTrack }) => {
    const isCurrentlyPlaying = currentTrack?.id === item.id;
    return (
      <TrackItem
        item={item}
        onPlay={handlePlayTrack}
        isPlaying={isCurrentlyPlaying}
        textStyle={isCurrentlyPlaying ? styles.playingTrackText : styles.trackText}
        onOptionsPress={() => {
          Alert.alert(
            'Remove from Playlist',
            'Are you sure you want to remove this track from the playlist?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Remove', onPress: () => handleRemoveTrack(item.id), style: 'destructive' },
            ]
          );
        }}
      />
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E72F2E" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.playlistHeader}>
        <Image
          source={{ uri: playlist.imageUrl }}
          style={styles.playlistImage}
          defaultSource={require('../../assests/logo/logo.png')}
        />
        <Text style={styles.playlistName}>{playlist.name}</Text>
        <Text style={styles.playlistInfo}>
          {tracks.length} songs • {playlist.creator}
        </Text>

        {tracks.length > 0 && (
          <TouchableOpacity style={styles.playButton} onPress={handlePlayAll}>
            <Icon name="play" size={24} color="#fff" />
            <Text style={styles.playButtonText}>Play All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={tracks}
        keyExtractor={item => item.id.toString()}
        renderItem={renderTrackItem}
        contentContainerStyle={styles.trackList}
        onRefresh={fetchPlaylistTracks}
        refreshing={refreshing}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="musical-notes-outline" size={80} color="#888" />
            <Text style={styles.emptyText}>No tracks in this playlist</Text>
            <Text style={styles.emptySubText}>
              Add tracks using the "Add to Playlist" option
            </Text>
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
          onClose={() => {}}
        />
      )}

      <View style={styles.bottomPadding} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  playlistHeader: {
    alignItems: 'center',
    padding: 20,
  },
  playlistImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
  },
  playlistName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  playlistInfo: {
    fontSize: 16,
    color: '#b3b3b3',
    marginBottom: 20,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E72F2E',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  trackList: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  playingTrackText: {
    color: '#E72F2E',
  },
  trackText: {
    color: '#fff',
  },
});

export default PlaylistDetails;