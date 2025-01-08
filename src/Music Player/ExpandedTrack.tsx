import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Modal,
  SafeAreaView,
  LayoutRectangle,
  GestureResponderEvent,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TrackPlayer, {useProgress} from 'react-native-track-player';
import {Track} from '../../type';
import styles from './Css/ExpandedTrackCss';
import {useAuth} from '../../asyncStorage/AsyncStorage';
import Share from 'react-native-share';

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
  const {token} = useAuth();
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);
  const progressBarRef = useRef<View>(null);
  const [shareCount, setShareCount] = useState(0);
  const [progressBarLayout, setProgressBarLayout] =
    useState<LayoutRectangle | null>(null);
  const API_BASE_URL = 'http://10.0.2.2:3000';

  useEffect(() => {
    if (!isSeeking) {
      setSeekPosition(progress.position);
    }
  }, [progress.position, isSeeking]);

  useEffect(() => {
    if (currentTrack?.id) {
      fetchLikeStatus();
    }
  }, [currentTrack?.id]);

  const fetchLikeStatus = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/music/${currentTrack?.id}/like`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      setIsLiked(data.liked);
      setLikes(data.likesCount);
    } catch (error) {
      console.error('Error fetching like status:', error);
    }
  };

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

  const handleLike = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/music/${currentTrack?.id}/like`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      setIsLiked(data.liked);
      setLikes(data.likesCount);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

 // Update the share handler
const handleShare = async () => {
  try {
    // First record the share in our backend
    const shareResponse = await fetch(
      `${API_BASE_URL}/api/music/${currentTrack?.id}/share`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ platform: 'general' })
      }
    );
    const shareData = await shareResponse.json();
    
    // Then open the share dialog
    const shareOptions = {
      message: `Check out "${currentTrack?.title}" by ${currentTrack?.artist}`,
      url: `${API_BASE_URL}/music/${currentTrack?.id}`,
      title: currentTrack?.title
    };
    
    const shareResult = await Share.open(shareOptions); // Changed from Share.share to Share.open
    
    if (shareResult.success) {
      // Update the share count in the UI
      setShareCount(shareData.sharesCount);
    }
  } catch (error) {
    console.error('Error sharing:', error);
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
                color={isLiked ? '#E9302F' : '#fff'}
              />
              <Text style={styles.interactionCount}>{likes}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onToggleSave}
              style={styles.interactionButton}>
              <Icon
                name={isSaved ? 'heart' : 'heart-outline'}
                size={24}
                color={isSaved ? '#E9302F' : '#fff'}
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
              onPress={handleShare}
              style={styles.interactionButton}>
              <Icon name="share-social-outline" size={24} color="#fff" />
              <Text style={styles.interactionCount}>{shareCount}</Text>
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

export default ExpandedPlayer;
