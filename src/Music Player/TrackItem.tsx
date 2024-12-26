import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Track} from '../../type';
import TrackOptionsMenu from './TrackOptionsMenu';
import styles from './Css/TrackItem';

interface TrackItemProps {
  item: Track;
  onPlay: (track: Track) => void;
  isEditing: boolean;
  onRemove: (id: string) => void;
  isSelected?: boolean;
}

const TrackItem: React.FC<TrackItemProps> = ({
  item,
  onPlay,
  isEditing,
  onRemove,
  isSelected = false,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  return (
    <View>
      <TouchableOpacity
        style={[styles.trackContainer, isSelected && styles.selectedTrack]}
        onPressIn={() => setIsHovered(true)}
        onPressOut={() => setIsHovered(false)}
        onPress={() => onPlay(item)}>
        <View style={styles.imageContainer}>
          <Image source={{uri: item.artwork}} style={styles.trackImage} />
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
        {isEditing ? (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(item.id)}>
            <Icon name="trash" size={20} color="#ff4444" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.optionsButton}
            onPress={() => setShowOptions(true)}>
            <Icon name="ellipsis-vertical" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      <TrackOptionsMenu
        visible={showOptions}
        onClose={() => setShowOptions(false)}
        track={item}
      />
    </View>
  );
};

export default TrackItem;
