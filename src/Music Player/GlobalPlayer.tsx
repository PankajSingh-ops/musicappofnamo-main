import React, {useState} from 'react';
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
import { useMusicPlayer } from './MusicContext';

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
  const { 
    isShuffled, 
    repeatMode, 
    toggleShuffle, 
    toggleRepeat 
  } = useMusicPlayer();
  const [isSaved, setIsSaved] = useState(false);

  if (!currentTrack) return null;

  const handlePress = () => {
    setIsExpanded(true);
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
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
              onPress={onToggleFavorite}
              style={[styles.controlButton, styles.favoriteButton]}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon name="heart" size={22} color="#1DB954" />
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
        onToggleSave={handleToggleSave}
        onToggleShuffle={toggleShuffle}
        onToggleRepeat={toggleRepeat}
        isSaved={isSaved}
        isShuffled={isShuffled}
        repeatMode={repeatMode}
      />
    </>
  );
};

export default GlobalPlayer;