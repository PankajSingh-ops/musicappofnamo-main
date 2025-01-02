import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Track} from '../../type';
import ExpandedPlayer from './ExpandedTrack';
import styles from './Css/GlobalPlayerCss';
import {useMusicPlayer} from './MusicContext';
import {useAuth} from '../../asyncStorage/AsyncStorage';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const {isShuffled, repeatMode, toggleShuffle, toggleRepeat} =
    useMusicPlayer();
  const [isFavorited, setIsFavorited] = useState(false);
  const {token} = useAuth();

  useEffect(() => {
    if (currentTrack && token) {
      checkFavoriteStatus();
    }
  }, [currentTrack, token]);

  const checkFavoriteStatus = async () => {
    if (!currentTrack || !token) return;

    try {
      const response = await fetch(
        `http://10.0.2.2:3000/api/favorites/check/${currentTrack.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error('Failed to check favorite status');

      const data = await response.json();
      setIsFavorited(data.isFavorited);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!currentTrack || !token) {
      Alert.alert('Error', 'Please log in to add favorites');
      return;
    }

    try {
      const method = isFavorited ? 'DELETE' : 'POST';
      const url = isFavorited
        ? `http://10.0.2.2:3000/api/favorites/${currentTrack.id}`
        : 'http://10.0.2.2:3000/api/favorites';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body:
          method === 'POST'
            ? JSON.stringify({musicId: currentTrack.id})
            : undefined,
      });

      if (!response.ok) throw new Error('Failed to update favorite');

      setIsFavorited(!isFavorited);
      onToggleFavorite(); // Notify parent component
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorite status');
    }
  };

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
              onPress={handleToggleFavorite}
              style={[styles.controlButton, styles.favoriteButton]}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon
                name={isFavorited ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorited ? '#1DB954' : '#fff'}
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
        onToggleSave={handleToggleFavorite}
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
