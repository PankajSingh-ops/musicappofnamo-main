import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Track } from '../../type';

interface TrackItemProps {
  item: Track;
  onPlay: (track: Track) => void;
  isEditing: boolean;
  onRemove: (id: string) => void;
}

const TrackItem: React.FC<TrackItemProps> = ({ item, onPlay, isEditing, onRemove }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <TouchableOpacity
      style={styles.trackContainer}
      onPressIn={() => setIsHovered(true)}
      onPressOut={() => setIsHovered(false)}
      onPress={() => onPlay(item)}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.trackImage} />
        {isHovered && (
          <View style={styles.playOverlay}>
            <Icon name="play-circle" size={40} color="#1DB954" />
          </View>
        )}
      </View>
      <View style={styles.trackDetails}>
        <Text style={styles.trackTitle}>{item.title}</Text>
        <Text style={styles.trackArtist}>{item.artist}</Text>
      </View>
      <Text style={styles.trackDuration}>{item.duration}</Text>
      {isEditing && (
        <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(item.id)}>
          <Icon name="trash" size={20} color="#ff4444" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  trackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282828',
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  trackImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  trackDetails: {
    flex: 1,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trackArtist: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  trackDuration: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  removeButton: {
    marginLeft: 10,
  },
});

export default TrackItem;
