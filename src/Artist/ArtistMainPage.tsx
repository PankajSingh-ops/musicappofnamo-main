import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from 'react-native';
import { Artist, ArtistSong } from '../../type';
import Icon from 'react-native-vector-icons/Ionicons';
import { sampleArtists } from './ArtistData';

// ArtistCard component remains the same
interface ArtistCardProps {
  artist: Artist;
  onPress: (artist: Artist) => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onPress }) => (
  <TouchableOpacity 
    style={styles.artistCard}
    onPress={() => onPress(artist)}
  >
    <Image source={{ uri: artist.imageUrl }} style={styles.artistImage} />
    <Text style={styles.artistName}>{artist.name}</Text>
    <Text style={styles.artistListeners}>
      {(artist.monthlyListeners / 1000000).toFixed(1)}M monthly listeners
    </Text>
  </TouchableOpacity>
);

const ArtistMainPage: React.FC = ({ navigation }: any) => {
  const handleArtistPress = (artist: Artist) => {
    navigation.navigate('ArtistDetail', { artist });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Popular Artists</Text>
      <FlatList
        horizontal
        data={sampleArtists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ArtistCard artist={item} onPress={handleArtistPress} />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.artistList}
      />
    </ScrollView>
  );
};

interface ArtistDetailPageProps {
  route: { params: { artist: Artist } };
}

const ArtistDetailPage: React.FC<ArtistDetailPageProps> = ({ route }) => {
  const { artist } = route.params;
  
  const renderSongItem = ({ item }: { item: ArtistSong }) => (
    <TouchableOpacity style={styles.songItem}>
      <Image 
        source={{ uri: item.albumCover }} 
        style={styles.songAlbumCover} 
      />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songMeta}>
          {item.albumName} • {item.duration}
        </Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Icon name="ellipsis-horizontal" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.detailContainer}>
      <ImageBackground
        source={{ uri: artist.coverImageUrl }}
        style={styles.artistCover}
      >
        {/* Gradient replacement - stack of semi-transparent views */}
        <View style={styles.gradientOverlay}>
          <View style={styles.artistHeader}>
            <Text style={styles.artistDetailName}>{artist.name}</Text>
            <Text style={styles.monthlyListeners}>
              {(artist.monthlyListeners / 1000000).toFixed(1)}M monthly listeners
            </Text>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.shuffleButton}>
          <Icon name="shuffle" size={24} color="#000" />
          <Text style={styles.shuffleText}>Shuffle Play</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followText}>Follow</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.popularSongs}>
        <Text style={styles.sectionTitle}>Popular</Text>
        <FlatList
          data={artist.songs}
          keyExtractor={(item) => item.id}
          renderItem={renderSongItem}
          scrollEnabled={false}
        />
      </View>

      <View style={styles.about}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bio}>{artist.bio}</Text>
        <View style={styles.genres}>
          {artist.genres.map((genre, index) => (
            <View key={index} style={styles.genreTag}>
              <Text style={styles.genreText}>{genre}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  artistList: {
    paddingHorizontal: 16,
  },
  artistCard: {
    marginRight: 16,
    alignItems: 'center',
    width: 150,
  },
  artistImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  artistName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  artistListeners: {
    color: '#b3b3b3',
    fontSize: 12,
    marginTop: 4,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  artistCover: {
    height: 350,
    width: '100%',
  },
  // New gradient replacement styles
  gradientOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 18, 18, 0.7)', // Semi-transparent dark overlay
    justifyContent: 'flex-end',
    padding: 16,
  },
  artistHeader: {
    marginBottom: 32,
  },
  artistDetailName: {
    color: '#fff',
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  monthlyListeners: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  shuffleButton: {
    flexDirection: 'row',
    backgroundColor: '#1DB954',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    marginRight: 16,
  },
  shuffleText: {
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  followButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#fff',
  },
  followText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  songItem: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  songAlbumCover: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
  },
  songTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  songMeta: {
    color: '#b3b3b3',
    fontSize: 14,
    marginTop: 4,
  },
  moreButton: {
    padding: 8,
  },
  about: {
    padding: 16,
  },
  bio: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  genreTag: {
    backgroundColor: '#282828',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#fff',
    fontSize: 12,
  },
  popularSongs: {
    marginTop: 16,
  },
});

export { ArtistMainPage, ArtistDetailPage };