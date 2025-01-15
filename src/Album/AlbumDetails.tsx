import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import TrackItem from '../Music Player/TrackItem';
import GlobalPlayer from '../Music Player/GlobalPlayer';
import { Track } from '../../type';
import { useMusicPlayer } from '../Music Player/MusicContext';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  AlbumDetail: {
    albumId: number;
    albumName: string;
    coverImage: string;
    genre: string;
    releaseDate: string;
  };
};

type AlbumDetailRouteProp = RouteProp<RootStackParamList, 'AlbumDetail'>;

interface Props {
  route: AlbumDetailRouteProp;
}

const AlbumDetail: React.FC<Props> = ({ route }) => {
  const { albumId, albumName, coverImage, genre, releaseDate } = route.params;
  const [songs, setSongs] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayback,
    skipToNext,
    skipToPrevious,
  } = useMusicPlayer();

  const fetchAlbumSongs = async () => {
    // Validate albumId before making the request
    if (!albumId || isNaN(albumId)) {
      setError('Invalid album ID');
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await axios.get(`http://10.0.2.2:3000/api/albums/${albumId}/songs`);
      
      const transformedSongs: Track[] = response.data.map((song: any) => ({
        id: song.id.toString(),
        title: song.title,
        artist: song.artist,
        artwork: coverImage,
        duration: song.duration || '0:00',
        url: song.url || '',
        track_number: song.track_number
      }));

      setSongs(transformedSongs);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to load album songs';
        console.error('Error fetching songs:', error.response?.data || error.message);
        setError(errorMessage);
      } else {
        console.error('Error fetching songs:', error);
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (albumId) {
      fetchAlbumSongs();
    }
  }, [albumId]);

  const handlePlayTrack = async (track: Track) => {
    try {
      await playTrack(track, songs);
    } catch (error) {
      console.error('Error playing track:', error);
      Alert.alert('Error', 'Failed to play track');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchAlbumSongs();
  };

  const renderTrackItem = ({ item }: { item: Track }) => {
    const isCurrentlyPlaying = currentTrack?.id === item.id;

    return (
      <TrackItem
        item={item}
        onPlay={handlePlayTrack}
        isPlaying={isCurrentlyPlaying && isPlaying}
        isEditing={false}
        onRemove={() => {}}
        isSelected={isCurrentlyPlaying}
      />
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => {
            setIsLoading(true);
            fetchAlbumSongs();
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.albumHeader}>
        <Image
          source={{ uri: coverImage }}
          style={styles.albumCover}
          resizeMode="cover"
        />
        <View style={styles.albumInfo}>
          <Text style={styles.albumName}>{albumName}</Text>
          <Text style={styles.albumGenre}>{genre}</Text>
          <Text style={styles.albumDate}>
            Released: {new Date(releaseDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <FlatList
        data={songs}
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
            <Text style={styles.emptyText}>No songs in this album</Text>
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
          onToggleFavorite={() => {}}
          onClose={() => {}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  albumHeader: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
  },
  albumCover: {
    width: 150,
    height: 150,
    borderRadius: 12,
  },
  albumInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  albumName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  albumGenre: {
    fontSize: 16,
    color: '#1DB954',
    marginBottom: 8,
  },
  albumDate: {
    fontSize: 14,
    color: '#888888',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    color: '#888888',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default AlbumDetail;
