import React, {useState, useEffect, useRef} from 'react';
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
  LayoutRectangle,
  GestureResponderEvent,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TrackPlayer, {useProgress} from 'react-native-track-player';
import {Track} from '../../type';

interface ExpandedPlayerProps {
  isVisible: boolean;
  onClose: () => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleSave: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  isSaved: boolean;
  isShuffled: boolean;
  repeatMode: 'off' | 'all' | 'one'; // Updated to match the types used in ExpandedPlayer
}

const ExpandedPlayer: React.FC<ExpandedPlayerProps> = ({
  isVisible,
  onClose,
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onToggleSave,
  onToggleShuffle,
  onToggleRepeat,
  isSaved,
  isShuffled,
  repeatMode,
}) => {
  const progress = useProgress();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);
  const progressBarRef = useRef<View>(null);
  const [progressBarLayout, setProgressBarLayout] =
    useState<LayoutRectangle | null>(null);

  useEffect(() => {
    if (!isSeeking) {
      setSeekPosition(progress.position);
    }
  }, [progress.position, isSeeking]);

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

  const handleStartSeeking = () => {
    setIsSeeking(true);
  };

  const handleEndSeeking = async () => {
    if (isSeeking) {
      await handleSeek(seekPosition);
      setIsSeeking(false);
    }
  };

  const calculateSeekPosition = (event: GestureResponderEvent) => {
    if (progressBarLayout) {
      const touch = event.nativeEvent;
      const touchX = touch.locationX;
      const percentage = Math.max(
        0,
        Math.min(1, touchX / progressBarLayout.width),
      );
      const newPosition = percentage * progress.duration;
      setSeekPosition(newPosition);
    }
  };

  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one':
        return 'repeat-one';
      case 'all':
        return 'repeat';
      default:
        return 'repeat-outline';
    }
  };

  if (!currentTrack || !isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.contentContainer, {opacity: fadeAnim}]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="chevron-down" size={30} color="#fff" />
          </TouchableOpacity>

          <View style={styles.artworkWrapper}>
            <View style={styles.mirrorEffect} />
            <View style={styles.artworkContainer}>
              <Image
                source={{uri: currentTrack.artwork}}
                style={styles.artwork}
              />
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.title}>{currentTrack.title}</Text>
            <Text style={styles.artist}>{currentTrack.artist}</Text>
          </View>

          <View style={styles.interactionContainer}>
            <TouchableOpacity
              onPress={handleLike}
              style={styles.interactionButton}>
              <Icon
                name={isLiked ? 'thumbs-up' : 'thumbs-up-outline'}
                size={24}
                color={isLiked ? '#1DB954' : '#fff'}
              />
              <Text style={styles.interactionCount}>{likes}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onToggleSave}
              style={styles.interactionButton}>
              <Icon
                name={isSaved ? 'heart' : 'heart-outline'}
                size={24}
                color={isSaved ? '#1DB954' : '#fff'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                /* Handle download */
              }}
              style={styles.interactionButton}>
              <Icon name="download-outline" size={24} color="#fff" />
              <Text style={styles.interactionCount}>128</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                /* Handle share */
              }}
              style={styles.interactionButton}>
              <Icon name="share-social-outline" size={24} color="#fff" />
              <Text style={styles.interactionCount}>45</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.progressContainer}>
            <View
              ref={progressBarRef}
              onLayout={event => {
                setProgressBarLayout(event.nativeEvent.layout);
              }}
              style={styles.progressBarContainer}
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderGrant={handleStartSeeking}
              onResponderMove={calculateSeekPosition}
              onResponderRelease={handleEndSeeking}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progress,
                    {
                      width: `${
                        ((isSeeking ? seekPosition : progress.position) /
                          progress.duration) *
                        100
                      }%`,
                    },
                  ]}
                />
              </View>
              <View
                style={[
                  styles.seekThumb,
                  {
                    left: `${
                      ((isSeeking ? seekPosition : progress.position) /
                        progress.duration) *
                      100
                    }%`,
                  },
                ]}
              />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.time}>
                {formatTime(isSeeking ? seekPosition : progress.position)}
              </Text>
              <Text style={styles.time}>{formatTime(progress.duration)}</Text>
            </View>
          </View>

          <View style={styles.mainControls}>
            <View style={styles.secondaryControls}>
              <TouchableOpacity
                onPress={onToggleShuffle}
                style={[
                  styles.controlButton,
                  isShuffled && styles.activeControl,
                ]}>
                <Icon name="shuffle" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onPrevious}>
                <Icon name="play-skip-back" size={35} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.playPauseButton}
                onPress={onPlayPause}>
                <Icon
                  name={isPlaying ? 'pause' : 'play'}
                  size={50}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={onNext}>
                <Icon name="play-skip-forward" size={35} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onToggleRepeat}
                style={[
                  styles.controlButton,
                  repeatMode !== 'off' && styles.activeControl,
                ]}>
                <Icon name={getRepeatIcon()} size={24} color="#fff" />
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
  artworkWrapper: {
    position: 'relative',
    alignItems: 'center',
    marginTop: 20,
  },
  progressContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  progressBarContainer: {
    height: 30,
    justifyContent: 'center',
    position: 'relative',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#404040',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#1DB954',
    borderRadius: 2,
  },
  seekThumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#1DB954',
    borderRadius: 6,
    top: '50%',
    marginTop: -6,
    transform: [{translateX: -6}],
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  time: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  mirrorEffect: {
    position: 'absolute',
    bottom: -100,
    width: Dimensions.get('window').width - 80,
    height: (Dimensions.get('window').width - 80) / 2,
    backgroundColor: 'transparent',
    transform: [{scaleY: -1}],
    opacity: 0.4,
    borderRadius: 20,
    zIndex: -1,
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
    marginTop: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 15,
  },

  artwork: {
    width: Dimensions.get('window').width - 80,
    height: Dimensions.get('window').width - 80,
    borderRadius: 20,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 20,
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
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Changed from space-around
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#404040',
  },
  interactionButton: {
    alignItems: 'center',
    paddingHorizontal: 8,
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  interactionCount: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  controlsContainer: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#282828',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
    maxHeight: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: 8,
  },
  mainControls: {
    marginTop: 30,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeControl: {
    backgroundColor: '#1DB954',
    transform: [{scale: 1.1}],
  },
  playPauseButton: {
    backgroundColor: '#1DB954',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1DB954',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    transform: [{scale: 1.1}],
  },
});

export default ExpandedPlayer;
