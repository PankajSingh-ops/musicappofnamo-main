import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalPlayer from '../../Music Player/GlobalPlayer';
import TrackItem from '../../Music Player/TrackItem';
import {Track} from '../../../type';
import {useMusicPlayer} from '../../Music Player/MusicContext';
import MusicListScreen from '../../Publisher/Common/MusicListScreen';
import {useAuth} from '../../../asyncStorage/AsyncStorage';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

interface MusicScreenProps {
  title: string;
}

const MusicScreen: React.FC<MusicScreenProps> = ({title}) => {
  const [topMusic, setTopMusic] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const {token} = useAuth();
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayback,
    skipToNext,
    skipToPrevious,
  } = useMusicPlayer();

  useEffect(() => {
    fetchTopMusic();
  }, []);

  const fetchTopMusic = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://10.0.2.2:3000/api/top-music', {
        headers: {
          Authorization: `Bearer ${token}`, // Assume token is available from context/props
        },
      });
      setTopMusic(response.data);
    } catch (error) {
      console.error('Error fetching top music:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = async (track: Track) => {
    await playTrack(track, topMusic);
  };

  const handleToggleFavorite = () => {
    console.log('Toggle favorite');
  };

  const renderTrackItem = ({item}: {item: Track}) => {
    const isCurrentlyPlaying = currentTrack?.id === item.id;

    return (
      <TrackItem
        item={item}
        onPlay={handlePlayTrack}
        isPlaying={isCurrentlyPlaying}
        textStyle={
          isCurrentlyPlaying ? styles.playingTrackText : styles.trackText
        }
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{title}</Text>
      </View>
      <FlatList
        data={topMusic}
        keyExtractor={item => item.id.toString()}
        renderItem={renderTrackItem}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="musical-notes-outline" size={80} color="#888" />
            <Text style={styles.emptyText}>No Music Available</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#121212',
    paddingBottom: 30,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginTop: 10,
  },
  trackText: {
    color: '#ffffff',
    fontSize: 16,
  },
  playingTrackText: {
    color: '#1DB954', // Spotify-like green color
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export const NewMusic: React.FC = () => {
  return <MusicListScreen />;
};

export const TopMusic: React.FC = () => {
  return <MusicScreen title="Top Music" />;
};

export default MusicScreen;
