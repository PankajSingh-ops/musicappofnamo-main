import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Track} from '../../type';
import TrackOptionsMenu from './TrackOptionsMenu';
import styles from './Css/TrackItem';
import { useTrackStore } from '../../store/useTrackStore';
import { useTrackOptionsStore } from '../../store/useTrackOptionStore';


interface TrackItemProps {
  item: Track;
  onPlay: (track: Track) => void;
  isEditing?: boolean;
  onRemove: (id: string) => void;
  isSelected?: boolean;
}

const TrackItem: React.FC<TrackItemProps> = ({
  item,
  onPlay,
  onRemove,
  isSelected = false,
}) => {
  const {
    hoveredTrackId,
    isEditMode,
    setHoveredTrack,
  } = useTrackStore();

  const {
    visibleTrackId,
    setVisibleTrack,
  } = useTrackOptionsStore();

  const isHovered = hoveredTrackId === item.id;
  const showOptions = visibleTrackId === item.id;

  return (
    <View>
      <TouchableOpacity
        style={[styles.trackContainer, isSelected && styles.selectedTrack]}
        onPressIn={() => setHoveredTrack(item.id)}
        onPressOut={() => setHoveredTrack(null)}
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
        {isEditMode ? (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(item.id)}>
            <Icon name="trash" size={20} color="#ff4444" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.optionsButton}
            onPress={() => setVisibleTrack(item.id)}>
            <Icon name="ellipsis-vertical" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      <TrackOptionsMenu
        visible={showOptions}
        onClose={() => setVisibleTrack(null)}
        track={item}
      />
    </View>
  );
};

export default TrackItem;