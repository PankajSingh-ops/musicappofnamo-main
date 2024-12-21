import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { Track } from '../../type';

interface ExpandedPlayerProps {
  isVisible: boolean;
  onClose: () => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleFavorite: () => void;
}

const ExpandedPlayer: React.FC<ExpandedPlayerProps> = ({
  isVisible,
  onClose,
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onToggleFavorite,
}) => {
  const progress = useProgress();
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = async (value: number) => {
    await TrackPlayer.seekTo(value);
  };

  if (!currentTrack || !isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.contentContainer,
            { opacity: fadeAnim }
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="chevron-down" size={30} color="#fff" />
          </TouchableOpacity>

          <View style={styles.artworkContainer}>
            <Image
              source={{ uri: currentTrack.artwork }}
              style={styles.artwork}
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.title}>{currentTrack.title}</Text>
            <Text style={styles.artist}>{currentTrack.artist}</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progress,
                  { width: `${(progress.position / progress.duration) * 100}%` }
                ]}
              />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.time}>{formatTime(progress.position)}</Text>
              <Text style={styles.time}>{formatTime(progress.duration)}</Text>
            </View>
          </View>

          <View style={styles.controlsContainer}>
            <TouchableOpacity onPress={onToggleFavorite}>
              <Icon name="heart" size={24} color="#1DB954" />
            </TouchableOpacity>
            <View style={styles.mainControls}>
              <TouchableOpacity onPress={onPrevious}>
                <Icon name="play-skip-back" size={35} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.playPauseButton}
                onPress={onPlayPause}
              >
                <Icon
                  name={isPlaying ? 'pause' : 'play'}
                  size={50}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={onNext}>
                <Icon name="play-skip-forward" size={35} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'center',
    padding: 10,
  },
  artworkContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  artwork: {
    width: Dimensions.get('window').width - 80,
    height: Dimensions.get('window').width - 80,
    borderRadius: 20,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  artist: {
    color: '#b3b3b3',
    fontSize: 18,
    marginTop: 5,
  },
  progressContainer: {
    marginTop: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#404040',
    borderRadius: 2,
  },
  progress: {
    height: '100%',
    backgroundColor: '#1DB954',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  time: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  controlsContainer: {
    marginTop: 40,
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  playPauseButton: {
    backgroundColor: '#1DB954',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
});

export default ExpandedPlayer;