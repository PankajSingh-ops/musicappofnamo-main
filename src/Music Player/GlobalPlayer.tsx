import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Track} from '../../type';

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
  if (!currentTrack) return null;

  return (
    <View style={styles.playerContainer}>
      <View style={styles.playerContent}>
        <Image source={{uri: currentTrack.image}} style={styles.playerImage} />
        <View style={styles.playerInfo}>
          <Text style={styles.playerTitle}>{currentTrack.title}</Text>
          <Text style={styles.playerArtist}>{currentTrack.artist}</Text>
        </View>
        <View style={styles.playerControls}>
          <TouchableOpacity onPress={onPrevious} style={styles.playerButton}>
            <Icon name="play-skip-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPlayPause} style={styles.playerButton}>
            <Icon name={isPlaying ? 'pause' : 'play'} size={32} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onNext} style={styles.playerButton}>
            <Icon name="play-skip-forward" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onToggleFavorite}
            style={styles.playerButton}>
            <Icon name="heart" size={24} color="#1DB954" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#282828',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#404040',
  },
  playerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerArtist: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerButton: {
    padding: 8,
  },
});

export default GlobalPlayer;
