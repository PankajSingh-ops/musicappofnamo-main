import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Track} from '../../type';
import ExpandedPlayer from './ExpandedTrack';
import styles from './Css/GlobalPlayerCss';
import {useMusicPlayer} from './MusicContext';
import {useAuth} from '../../asyncStorage/AsyncStorage';
import { useGlobalPlayerStore } from '../../store/useGlobalStore';

interface GlobalPlayerProps {
  currentTrack: Track | null;
  onClose: () => void;
  onPlayPause: () => void;
  isPlaying: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onToggleFavorite: () => void;
}

const GlobalPlayer: React.FC<GlobalPlayerProps> = ({
  currentTrack,
  onClose,
  onPlayPause,
  isPlaying,
  onNext,
  onPrevious,
  onToggleFavorite,
}) => {
  const [animation] = useState(new Animated.Value(0));
  const {isShuffled, repeatMode, toggleShuffle, toggleRepeat} = useMusicPlayer();
  const {token} = useAuth();
  
  const {
    isExpanded,
    isFavorited,
    setIsExpanded,
    resetPlayTime,
    clearPlayCountTimer,
    checkFavoriteStatus,
    handleToggleFavorite,
    updatePlayCount,
    setPlayCountTimer,
    setPlayTime,
  } = useGlobalPlayerStore();

  useEffect(() => {
    resetPlayTime();
  }, [currentTrack]);

  useEffect(() => {
    if (isPlaying && currentTrack) {
      const timer = setInterval(() => {
        setPlayTime((prev) => {
          const newTime = prev + 1;
          if (newTime === 30) {
            updatePlayCount(currentTrack, token);
            clearInterval(timer);
          }
          return newTime;
        });
      }, 1000);

      setPlayCountTimer(timer);

      return () => {
        clearInterval(timer);
        clearPlayCountTimer();
      };
    } else {
      clearPlayCountTimer();
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (currentTrack && token) {
      checkFavoriteStatus(currentTrack, token);
    }
  }, [currentTrack, token]);

  if (!currentTrack) return null;

  const handlePress = () => {
    setIsExpanded(true);
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={styles.playerContainer}>
        <Animated.View
          style={[
            styles.playerContent,
            {
              transform: [
                {
                  scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.98],
                  }),
                },
              ],
            },
          ]}>
          <View style={styles.leftSection}>
            <Image
              source={{uri: currentTrack.artwork}}
              style={styles.playerImage}
            />
            <View style={styles.playerInfo}>
              <Text style={styles.playerTitle} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text style={styles.playerArtist} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            </View>
          </View>

          <View style={styles.playerControls}>
            <TouchableOpacity
              onPress={onPrevious}
              style={styles.controlButton}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon name="play-skip-back" size={22} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onPlayPause}
              style={styles.playPauseButton}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon
                name={isPlaying ? 'pause' : 'play'}
                size={28}
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onNext}
              style={styles.controlButton}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon name="play-skip-forward" size={22} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleToggleFavorite(currentTrack, token, onToggleFavorite)}
              style={[styles.controlButton, styles.favoriteButton]}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon
                name={isFavorited ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorited ? '#E9302F' : '#fff'}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>

      <ExpandedPlayer
        isVisible={isExpanded}
        onClose={() => setIsExpanded(false)}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={onPlayPause}
        onNext={onNext}
        onPrevious={onPrevious}
        onToggleSave={() => handleToggleFavorite(currentTrack, token, onToggleFavorite)}
        onToggleShuffle={toggleShuffle}
        onToggleRepeat={toggleRepeat}
        isSaved={isFavorited}
        isShuffled={isShuffled}
        repeatMode={repeatMode}
      />
    </>
  );
};

export default GlobalPlayer;