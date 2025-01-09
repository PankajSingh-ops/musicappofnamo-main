import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../../asyncStorage/AsyncStorage';
import {useMusicPlayer} from '../../Music Player/MusicContext';
import GlobalPlayer from '../../Music Player/GlobalPlayer';
import styles from './Css/MuiscListScreenCss';
import TrackItem from '../../Music Player/TrackItem';

const API_BASE_URL = 'http://10.0.2.2:3000';

const MusicListScreen = () => {
  const navigation = useNavigation();
  const {token, user} = useAuth();
  const [music, setMusic] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [playerVisible] = useState(new Animated.Value(0));
  const [showOptions, setShowOptions] = useState<boolean>(false);
  

  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayback,
    skipToNext,
    skipToPrevious,
    setQueue,
  } = useMusicPlayer();

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [availability, setAvailability] = useState('public');

  const genres = [
    'All',
    'Pop',
    'Rock',
    'Hip Hop',
    'R&B',
    'Jazz',
    'Classical',
    'Electronic',
    'Folk',
    'Country',
  ];

  useEffect(() => {
    Animated.timing(playerVisible, {
      toValue: currentTrack ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentTrack]);

  const fetchMusic = async (page = 1, refreshList = false) => {
    try {
      if (!refreshList) setLoading(true);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(selectedGenre && selectedGenre !== 'All' && {genre: selectedGenre}),
        ...(search && {search}),
        availability,
      }).toString();

      const response = await fetch(`${API_BASE_URL}/api/music?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const data = await response.json();
      console.log(data, 'data');
      

      if (refreshList || page === 1) {
        setMusic(data.music || []);
      } else {
        setMusic(prev => [...prev, ...(data.music || [])]);
      }

      setPagination({
        currentPage: data.pagination?.current_page || page,
        totalPages: data.pagination?.total_pages || 1,
        totalItems: data.pagination?.total_items || 0,
      });
    } catch (error) {
      console.error('Error fetching music:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMusic(1, true);
  }, [search, selectedGenre, availability]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMusic(1, true);
  };

  const handlePlayTrack = async (track: any) => {
    try {
      if (currentTrack?.id === track.id) {
        togglePlayback();
        return;
      }

      // Update queue with current list starting from selected track
      const trackIndex = music.findIndex(t => t.id === track.id);
      const newQueue = [
        ...music.slice(trackIndex),
        ...music.slice(0, trackIndex),
      ];
      setQueue(newQueue);

      await playTrack(track, newQueue);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const renderMusicItem = ({item}: any) => {
    const isCurrentlyPlaying = currentTrack?.id === item.id;

    return (
      <TrackItem
        item={item}
        onPlay={handlePlayTrack}
        isPlaying={isCurrentlyPlaying && isPlaying}
        isSelected={isCurrentlyPlaying}
      />
    );
  };

  const renderGenreFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.genreFilter}>
      {genres.map(genre => (
        <TouchableOpacity
          key={genre}
          style={[
            styles.genreButton,
            selectedGenre === genre && styles.genreButtonActive,
          ]}
          onPress={() => setSelectedGenre(genre === 'All' ? '' : genre)}>
          <Text
            style={[
              styles.genreButtonText,
              selectedGenre === genre && styles.genreButtonTextActive,
            ]}>
            {genre}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const playerTranslateY = playerVisible.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Icon name="search" size={24} color="#fff" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search music..."
            placeholderTextColor="#777"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {renderGenreFilter()}

      <FlatList
        data={music}
        renderItem={renderMusicItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={[
          styles.list,
          currentTrack && styles.listWithPlayer,
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={() => {
          if (pagination.currentPage < pagination.totalPages) {
            fetchMusic(pagination.currentPage + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loading && <ActivityIndicator size="large" color="#1DB954" />
        }
        ListEmptyComponent={() =>
          !loading && (
            <View style={styles.emptyState}>
              <Icon name="music-off" size={48} color="#777" />
              <Text style={styles.emptyStateText}>No music found</Text>
            </View>
          )
        }
      />

      {currentTrack && (
        <Animated.View
          style={[
            styles.playerContainer,
            {transform: [{translateY: playerTranslateY}]},
          ]}>
          <GlobalPlayer
            currentTrack={currentTrack}
            onPlayPause={togglePlayback}
            isPlaying={isPlaying}
            onNext={skipToNext}
            onPrevious={skipToPrevious}
            onToggleFavorite={() => {}}
            onClose={() => {
              pauseTrack();
              setQueue([]);
            }}
          />
        </Animated.View>
      )}
      
    </View>
  );
};

export default MusicListScreen;