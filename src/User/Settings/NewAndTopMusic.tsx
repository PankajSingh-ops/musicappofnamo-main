import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalPlayer from '../../Music Player/GlobalPlayer';
import TrackItem from '../../Music Player/TrackItem';
import {Track} from '../../../type';
import {useMusicPlayer} from '../../Music Player/MusicContext';
import MusicListScreen from '../../Publisher/Common/MusicListScreen';

const newMusicData: Track[] = [
  {
    id: 'new1',
    title: 'New Release 1',
    artist: 'Artist 1',
    url: require('../../../audio/lamhe.mp3'),
    artwork:
      'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/pop-music-album-cover-design-template-%281%29-f3b873e61465d4524bb99bf02a56c649_screen.jpg?ts=1706311822',
    duration: '3:50',
  },
];

const topMusicData: Track[] = [
  {
    id: 'top1',
    title: 'Top Hit 1',
    artist: 'Artist 1',
    url: require('../../../audio/hindi.mp3'),
    artwork:
      'https://img.freepik.com/free-vector/gradient-album-cover-template_23-2150597431.jpg',
    duration: '5:00',
  },
  {
    id: 'top2',
    title: 'Top Hit 2',
    artist: 'Artist 2',
    url: require('../../../audio/faasle.mp3'),
    artwork:
      'https://img.freepik.com/free-vector/gradient-album-cover-template_23-2150597431.jpg',
    duration: '5:00',
  },
  // Add more tracks as needed
];

interface MusicScreenProps {
  title: string;
  musicData: Track[];
}

const MusicScreen: React.FC<MusicScreenProps> = ({title, musicData}) => {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayback,
    skipToNext,
    skipToPrevious,
  } = useMusicPlayer();

  const handlePlayTrack = async (track: Track) => {
    await playTrack(track, musicData);
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

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.screenTitle}>{title}</Text>
      </View>
      <FlatList
        data={musicData}
        keyExtractor={item => item.id}
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
          onClose={() => {
          }}
        />
      )}
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
  trackText: {
    color: '#fff',
  },
  playingTrackText: {
    color: '#1DB954', // Spotify-like green color for playing track
    fontWeight: 'bold',
  },
});

export const NewMusic: React.FC = () => {
  return <MusicListScreen/>;
};

export const TopMusic: React.FC = () => {
  return <MusicScreen title="Top Music" musicData={topMusicData} />;
};

export default MusicScreen;
