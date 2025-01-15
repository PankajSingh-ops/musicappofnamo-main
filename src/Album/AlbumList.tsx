import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import {useAuth} from '../../asyncStorage/AsyncStorage';
import {useMusicPlayer} from '../Music Player/MusicContext';
import GlobalPlayer from '../Music Player/GlobalPlayer';

const BACKEND_URL = 'http://10.0.2.2:3000';
const {width} = Dimensions.get('window');
const COLUMN_NUM = 2;
const ALBUM_WIDTH = (width - 40) / COLUMN_NUM;

const GENRES = [
  'All',
  'Pop',
  'Rock',
  'Hip Hop',
  'Jazz',
  'Classical',
  'Electronic',
  'R&B',
  'Country',
  'Folk',
];

const AlbumList = ({navigation}: any) => {
  const {token} = useAuth();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Add music player context
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayback,
    skipToNext,
    skipToPrevious,
  } = useMusicPlayer();

  useEffect(() => {
    fetchAlbums();
  }, [selectedGenre]);

  const fetchAlbums = async () => {
    try {
      let url = `${BACKEND_URL}/api/public/albums`;
      if (selectedGenre !== 'All') {
        url += `?genre=${selectedGenre}`;
      }
      const response = await axios.get(url);
      setAlbums(response.data);
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/albums/search?q=${query}&genre=${selectedGenre}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setAlbums(response.data);
    } catch (error) {
      console.error('Error searching albums:', error);
    }
  };

  const renderGenreItem = (genre: string) => (
    <TouchableOpacity
      key={genre}
      style={[
        styles.genreButton,
        selectedGenre === genre && styles.genreButtonSelected,
      ]}
      onPress={() => setSelectedGenre(genre)}>
      <Text
        style={[
          styles.genreText,
          selectedGenre === genre && styles.genreTextSelected,
        ]}>
        {genre}
      </Text>
    </TouchableOpacity>
  );

  const renderAlbumItem = ({item}: any) => (
    <TouchableOpacity
      style={styles.albumCard}
      onPress={() => navigation.navigate('AlbumDetail', {
        album: item,
        // Pass the music player functions to AlbumDetail
        musicPlayerFunctions: {
          playTrack,
          togglePlayback,
          skipToNext,
          skipToPrevious,
        }
      })}>
      <Image
        source={{uri: item.cover_image}}
        style={styles.albumCover}
        resizeMode="cover"
      />
      <View style={styles.albumInfo}>
        <Text style={styles.albumName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.albumDetails} numberOfLines={1}>
          {item.songs?.length || 0} tracks • {item.genre}
        </Text>
        <Text style={styles.releaseDate}>
          {new Date(item.release_date).getFullYear()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search albums..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.genreContainer}>
        {GENRES.map(renderGenreItem)}
      </ScrollView>

      <FlatList
        data={albums}
        renderItem={renderAlbumItem}
        keyExtractor={item => item.id.toString()}
        numColumns={COLUMN_NUM}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Add GlobalPlayer */}
      {currentTrack && (
        <GlobalPlayer
          currentTrack={currentTrack}
          onPlayPause={togglePlayback}
          isPlaying={isPlaying}
          onNext={skipToNext}
          onPrevious={skipToPrevious}
          onClose={() => {
            // Optional: Implement close behavior
          }}
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
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: '#1A1A1A',
    borderRadius: 25,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    elevation: 3,
  },
  genreContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  genreButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  genreButtonSelected: {
    backgroundColor: '#FF0000',
    borderColor: '#FF0000',
  },
  genreText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  genreTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  albumCard: {
    width: ALBUM_WIDTH,
    marginHorizontal: 4,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#FF0000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  albumCover: {
    width: '100%',
    height: ALBUM_WIDTH,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  albumInfo: {
    padding: 12,
  },
  albumName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  albumDetails: {
    fontSize: 12,
    color: '#FF0000',
    marginBottom: 4,
  },
  releaseDate: {
    fontSize: 12,
    color: '#888888',
  },
});

export default AlbumList;
