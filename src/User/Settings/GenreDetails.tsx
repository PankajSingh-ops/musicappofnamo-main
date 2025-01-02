import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, Track} from '../../../type';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../../asyncStorage/AsyncStorage';
import { useMusicPlayer } from '../../Music Player/MusicContext';
import TrackItem from '../../Music Player/TrackItem';
import GlobalPlayer from '../../Music Player/GlobalPlayer';


const {width} = Dimensions.get('window');
const HEADER_HEIGHT = width * 0.7;
const API_BASE_URL = 'http://10.0.2.2:3000';

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
  has_previous: boolean;
}

type GenreDetailsProps = NativeStackScreenProps<
  RootStackParamList,
  'GenreDetails'
>;

const GenreDetails = ({route, navigation}: GenreDetailsProps) => {
  const {genre}: any = route.params;
  const {token} = useAuth();
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayback,
    skipToNext,
    skipToPrevious,
  } = useMusicPlayer();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchTracks = async (page: number = 1) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        genre: genre.name,
        availability: 'public',
      }).toString();

      const response = await fetch(`${API_BASE_URL}/api/music?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (page === 1) {
        setTracks(data.music);
      } else {
        setTracks(prevTracks => [...prevTracks, ...data.music]);
      }
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, [genre.name]);

  const handlePlayTrack = async (track: Track) => {
    await playTrack(track, tracks);
  };

  const handleLoadMore = () => {
    if (pagination?.has_next && !loading) {
      setCurrentPage(prev => prev + 1);
      fetchTracks(currentPage + 1);
    }
  };
  const handleToggleFavorite = () => {
    // Implement favorite toggling logic
    console.log('Toggle favorite');
  };

  const renderTrackItem = ({item}: {item: Track}) => {
    const isCurrentlyPlaying = currentTrack?.id === item.id;

    return (
      <TrackItem
        item={item}
        onPlay={handlePlayTrack}
        isPlaying={isCurrentlyPlaying && isPlaying}
        textStyle={
          isCurrentlyPlaying ? styles.playingTrackText : styles.trackText
        }
      />
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#1DB954" />
      </View>
    );
  };

  const ListHeader = () => (
    <>
      <View style={styles.headerContainer}>
        <Image source={genre.image} style={styles.headerImage} />
        <View style={styles.headerOverlay} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{genre.name}</Text>
        <Text style={styles.songCount}>
          {genre.totalSongs.toLocaleString()} songs
        </Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => tracks.length > 0 && handlePlayTrack(tracks[0])}>
            <Icon name="play" size={24} color="white" />
            <Text style={styles.playButtonText}>Play All</Text>
          </TouchableOpacity>

          <View style={styles.secondaryButtons}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="heart-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="share-social-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>About this genre</Text>
          <Text style={styles.description}>
            Explore the best of {genre.name} music with our carefully curated
            collection of {genre.totalSongs.toLocaleString()} tracks. From
            classics to latest hits, immerse yourself in the rhythm and soul of
            this genre.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Songs</Text>
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={tracks}
        renderItem={renderTrackItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={ListHeader}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tracks available</Text>
            </View>
          )
        }
        contentContainerStyle={styles.flatListContent}
      />

      {currentTrack && (
        <GlobalPlayer
          currentTrack={currentTrack}
          onPlayPause={togglePlayback}
          isPlaying={isPlaying}
          onToggleFavorite={handleToggleFavorite}
          onNext={skipToNext}
          onPrevious={skipToPrevious}
          onClose={() => {
            /* Implement close behavior */
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  flatListContent: {
    flexGrow: 1,
  },
  headerContainer: {
    position: 'relative',
    height: HEADER_HEIGHT,
  },
  headerImage: {
    width: width,
    height: HEADER_HEIGHT,
    resizeMode: 'cover',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  songCount: {
    fontSize: 16,
    color: '#B3B3B3',
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1DB954',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  playButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#B3B3B3',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  trackText: {
    color: '#fff',
  },
  playingTrackText: {
    color: '#1DB954',
    fontWeight: 'bold',
  },
  loaderContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#B3B3B3',
    fontSize: 16,
  },
});

export default GenreDetails;
