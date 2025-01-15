import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {useAuth} from '../../asyncStorage/AsyncStorage';

interface Artist {
  id: number;
  name: string;
  image_url: string;
  followers: number;
}

const DEFAULT_IMAGE = 'https://namomusic.site/themes/volcano/img/logo.png?cache=147';

// ArtistCard component
interface ArtistCardProps {
  artist: Artist;
  onPress: (artist: Artist) => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({artist, onPress}) => (
  <TouchableOpacity style={styles.artistCard} onPress={() => onPress(artist)}>
    <Image
      source={{uri: artist.image_url || DEFAULT_IMAGE}}
      style={styles.artistImage}
      defaultSource={require('../../assests/logo/logo.png')}
    />
    <Text style={styles.artistName}>{artist.name}</Text>
    <Text style={styles.artistFollowers}>
      {artist.followers.toLocaleString()} followers
    </Text>
  </TouchableOpacity>
);

const ArtistMainPage: React.FC = ({navigation}: any) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayedArtists, setDisplayedArtists] = useState<Artist[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const {token} = useAuth();
  
  const ARTISTS_PER_PAGE = 10;

  useEffect(() => {
    fetchArtists();
  }, []);

  useEffect(() => {
    updateDisplayedArtists();
  }, [artists, currentPage]);

  const fetchArtists = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:3000/api/artists', {
        headers: {Authorization: `Bearer ${token}`},
      });
      setArtists(response.data);
    } catch (error) {
      console.error('Error fetching artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayedArtists = () => {
    const startIndex = 0;
    const endIndex = currentPage * ARTISTS_PER_PAGE;
    setDisplayedArtists(artists.slice(startIndex, endIndex));
  };

  const handleLoadMore = () => {
    if (displayedArtists.length < artists.length) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleArtistPress = (artist: Artist) => {
    navigation.navigate('ArtistDetail', {artistId: artist.id});
  };

  const renderItem = ({item, index}: {item: Artist; index: number}) => (
    <View style={styles.artistCardContainer}>
      <ArtistCard artist={item} onPress={handleArtistPress} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#CE2C29" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Popular Artists</Text>
      <FlatList
        data={displayedArtists}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.artistGrid}
      />
      {displayedArtists.length < artists.length && (
        <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
          <Text style={styles.loadMoreText}>Show More</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  artistGrid: {
    paddingHorizontal: 8,
  },
  artistCardContainer: {
    width: '50%',
    padding: 8,
  },
  artistCard: {
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 12,
  },
  artistImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 75,
  },
  artistName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  artistFollowers: {
    color: '#b3b3b3',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  loadMoreButton: {
    backgroundColor: '#CE2C29',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ArtistMainPage;