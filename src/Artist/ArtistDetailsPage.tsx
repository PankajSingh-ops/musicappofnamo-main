import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useAuth } from '../../asyncStorage/AsyncStorage';
import GlobalPlayer from '../Music Player/GlobalPlayer';
import TrackItem from '../Music Player/TrackItem';
import { useMusicPlayer } from '../Music Player/MusicContext';
import { Track } from '../../type';

interface Artist {
  id: number;
  name: string;
  image_url: string;
  followers: number;
  bio?: string;
  songs?: Track[];
  country?: string;
  is_following?: boolean;
}

const DEFAULT_IMAGE = 'https://namomusic.site/themes/volcano/img/logo.png?cache=147';

interface ArtistDetailPageProps {
  route: {params: {artistId: number}};
}

const ArtistDetailPage: React.FC<ArtistDetailPageProps> = ({route}) => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const {token} = useAuth();
  const {artistId} = route.params;

  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayback,
    skipToNext,
    skipToPrevious,
  } = useMusicPlayer();

  useEffect(() => {
    fetchArtistDetails();
  }, [artistId]);

  const fetchArtistDetails = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:3000/api/artists/${artistId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      setArtist(response.data);
    } catch (error) {
      console.error('Error fetching artist details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!artist || followLoading) return;

    setFollowLoading(true);
    try {
      if (!artist.is_following) {
        // Follow the artist
        await axios.post(
          `http://10.0.2.2:3000/api/artists/${artistId}/follow`,
          {},
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
        setArtist(prev => prev ? {
          ...prev,
          is_following: true,
          followers: prev.followers + 1
        } : null);
      } else {
        // Unfollow the artist
        await axios.delete(
          `http://10.0.2.2:3000/api/artists/${artistId}/follow`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
        setArtist(prev => prev ? {
          ...prev,
          is_following: false,
          followers: prev.followers - 1
        } : null);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handlePlayTrack = async (track: Track) => {
    if (artist?.songs) {
      await playTrack(track, artist.songs);
    }
  };

  const handleShufflePlay = async () => {
    if (artist?.songs && artist.songs.length > 0) {
      const randomIndex = Math.floor(Math.random() * artist.songs.length);
      await playTrack(artist.songs[randomIndex], artist.songs);
    }
  };

  const handleToggleFavorite = async () => {
    // Implement favorite toggle functionality
  };

  const renderSongItem = ({item}: {item: Track}) => {
    const isCurrentlyPlaying = currentTrack?.id === item.id;

    return (
      <TrackItem
        item={item}
        onPlay={handlePlayTrack}
        isPlaying={isCurrentlyPlaying && isPlaying}
        isEditing={false}
        isSelected={isCurrentlyPlaying}
      />
    );
  };

  if (loading || !artist) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#CE2C29" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        <ImageBackground
          source={{uri: artist.image_url || DEFAULT_IMAGE}}
          style={styles.artistCover}>
          <View style={styles.gradientOverlay}>
            <View style={styles.artistHeader}>
              <Text style={styles.artistDetailName}>{artist.name}</Text>
              <Text style={styles.followers}>
                {artist.followers.toLocaleString()} followers
              </Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.shuffleButton} onPress={handleShufflePlay}>
            <Icon name="shuffle" size={24} color="#fff" />
            <Text style={styles.shuffleText}>Shuffle Play</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.followButton,
              artist.is_following && styles.followingButton,
              followLoading && styles.disabledButton
            ]} 
            onPress={handleFollowToggle}
            disabled={followLoading}
          >
            {followLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.followText}>
                {artist.is_following ? 'Following' : 'Follow'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {artist.songs && artist.songs.length > 0 && (
          <View style={styles.popularSongs}>
            <Text style={styles.sectionTitle}>Popular</Text>
            <FlatList
              data={artist.songs}
              keyExtractor={item => item.id.toString()}
              renderItem={renderSongItem}
              scrollEnabled={false}
            />
          </View>
        )}

        {artist.bio && (
          <View style={styles.about}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{artist.bio}</Text>
            {artist.country && (
              <View style={styles.genreTag}>
                <Text style={styles.genreText}>{artist.country}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

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

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
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
  artistCover: {
    height: 350,
    width: '100%',
  },
  gradientOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 18, 18, 0.7)',
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
  followers: {
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
    backgroundColor: '#CE2C29',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    marginRight: 16,
  },
  shuffleText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  followButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#fff',
    minWidth: 100,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: '#1DB954',
    borderColor: '#1DB954',
  },
  disabledButton: {
    opacity: 0.6,
  },
  followText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
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
  genreTag: {
    backgroundColor: '#282828',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  genreText: {
    color: '#fff',
    fontSize: 12,
  },
  popularSongs: {
    marginTop: 16,
  },
});

export default ArtistDetailPage;