import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useMusicPlayer} from '../Music Player/MusicContext';
import {Track} from '../../type';
import TrackItem from '../Music Player/TrackItem';
import GlobalPlayer from '../Music Player/GlobalPlayer';

const PlaylistDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {playlist} = route.params;
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayback,
    skipToNext,
    skipToPrevious,
  } = useMusicPlayer();

  // Sample tracks data
  const tracks: Track[] = [
    {
      id: 'track1',
      title: 'New Release 1',
      artist: 'Artist 1',
      url: require('../../audio/lamhe.mp3'),
      artwork:
        'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/pop-music-album-cover-design-template-%281%29-f3b873e61465d4524bb99bf02a56c649_screen.jpg?ts=1706311822',
      duration: '3:50',
    },
    {
      id: 'track2',
      title: 'Top Hit 1',
      artist: 'Artist 1',
      url: require('../../audio/hindi.mp3'),
      artwork:
        'https://img.freepik.com/free-vector/gradient-album-cover-template_23-2150597431.jpg',
      duration: '5:00',
    },
    // Add more tracks as needed
  ];

  const handlePlayTrack = async (track: Track) => {
    await playTrack(track, tracks);
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
          source={{uri: playlist.imageUrl}}
          style={styles.playlistImage}
          defaultSource={require('../../assests/logo/logo.png')}
        />
        <Text style={styles.playlistName}>{playlist.name}</Text>
        <Text style={styles.playlistInfo}>
          {playlist.totalSongs} songs • {playlist.creator}
        </Text>

        <TouchableOpacity style={styles.playButton}>
          <Icon name="play" size={24} color="#fff" />
          <Text style={styles.playButtonText}>Play All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tracks}
        keyExtractor={item => item.id}
        renderItem={renderTrackItem}
        contentContainerStyle={styles.trackList}
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

      <View style={styles.bottomPadding} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
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
  },
  playingTrackText: {
    color: '#E72F2E',
  },
  trackText: {
    color: '#fff',
  },
  bottomPadding: {
    height: 100, // Space for the GlobalPlayer
  },
});

export default PlaylistDetails;
