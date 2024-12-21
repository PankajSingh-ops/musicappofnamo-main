import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TrackPlayer, { useTrackPlayerEvents, Event, State } from 'react-native-track-player';
import GlobalPlayer from '../../Music Player/GlobalPlayer';
import TrackItem from '../../Music Player/TrackItem';
import { setupPlayer } from '../../components/TrackPlayer';
import { Track } from '../../../type';

// Sample data for new music
const newMusicData: Track[] = [
  {
    id: 'new1',
    title: 'New Release 1',
    artist: 'Artist 1',
    url: require('../../../audio/lamhe.mp3'),
    artwork: 'https://example.com/artwork1.jpg',
    duration:'3:50'
  },
  // Add more tracks as needed
];

const topMusicData: Track[] = [
  {
    id: 'top1',
    title: 'Top Hit 1',
    artist: 'Artist 1',
    url: require('../../../audio/hindi.mp3'),
    artwork: 'https://example.com/topartwork1.jpg',
    duration:'5:00'
  },
  // Add more tracks as needed
];

interface MusicScreenProps {
  title: string;
  musicData: Track[];
}

const MusicScreen: React.FC<MusicScreenProps> = ({ title, musicData }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const initializePlayer = async () => {
      try {
        await setupPlayer();
        await TrackPlayer.reset();
        const tracks = musicData.map(track => ({
          id: track.id,
          url: track.url,
          title: track.title,
          artist: track.artist,
          artwork: track.artwork,
        }));
        await TrackPlayer.add(tracks);
      } catch (error) {
        console.error('Error initializing player:', error);
      }
    };

    initializePlayer();
  }, [musicData]);

  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    if (event.type === Event.PlaybackState) {
      const state = await TrackPlayer.getState();
      setIsPlaying(state === State.Playing);
    }
  });

  const handlePlayTrack = async (track: Track) => {
    try {
      const index = musicData.findIndex(t => t.id === track.id);
      await TrackPlayer.skip(index);
      setCurrentTrack(track);
      await TrackPlayer.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handleNext = async () => {
    try {
      await TrackPlayer.skipToNext();
      const trackIndex = await TrackPlayer.getCurrentTrack();
      if (trackIndex !== null) {
        setCurrentTrack(musicData[trackIndex]);
      }
    } catch (error) {
      console.error('Error skipping to next track:', error);
    }
  };

  const handlePrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
      const trackIndex = await TrackPlayer.getCurrentTrack();
      if (trackIndex !== null) {
        setCurrentTrack(musicData[trackIndex]);
      }
    } catch (error) {
      console.error('Error skipping to previous track:', error);
    }
  };

  const handleToggleFavorite = () => {
    // Implement favorite toggling logic
    console.log('Toggle favorite');
  };

  const renderTrackItem = ({ item }: { item: Track }) => {
    const isCurrentlyPlaying = currentTrack?.id === item.id;
    
    return (
      <TrackItem
        item={item}
        onPlay={handlePlayTrack}
        isPlaying={isCurrentlyPlaying}
        textStyle={isCurrentlyPlaying ? styles.playingTrackText : styles.trackText}
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
          onPlayPause={handlePlayPause}
          isPlaying={isPlaying}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setCurrentTrack(null)}
        />
      )}
    </View>
  );
};

export const NewMusic: React.FC = () => {
  return <MusicScreen title="New Release" musicData={newMusicData} />;
};

export const TopMusic: React.FC = () => {
  return <MusicScreen title="Top Music" musicData={topMusicData} />;
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

export default MusicScreen;