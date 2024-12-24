import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Track} from '../../type';
import ExpandedPlayer from './ExpandedTrack';

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
        onToggleFavorite={onToggleFavorite}
      />
    </>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#282828',
    borderTopWidth: 1,
    borderTopColor: '#404040',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    paddingBottom: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  playerImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#404040',
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  playerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  playerArtist: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
    marginHorizontal: 2,
  },
  playPauseButton: {
    padding: 8,
    marginHorizontal: 2,
    backgroundColor: 'transparent',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    marginLeft: 4,
  },
});

export default GlobalPlayer;
