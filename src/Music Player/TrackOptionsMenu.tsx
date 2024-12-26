import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Track } from '../../type';

interface TrackOptionsMenuProps {
  visible: boolean;
  onClose: () => void;
  track: Track;
}

const TrackOptionsMenu: React.FC<TrackOptionsMenuProps> = ({
  visible,
  onClose,
  track,
}) => {
  const menuOptions = [
    {
      icon: 'heart-outline',
      label: 'Like',
      onPress: () => {
        // Handle like action
        onClose();
      },
    },
    {
      icon: 'add-circle-outline',
      label: 'Add to Playlist',
      onPress: () => {
        // Handle add to playlist
        onClose();
      },
    },
    {
      icon: 'person-outline',
      label: 'View Artist',
      onPress: () => {
        // Handle view artist
        onClose();
      },
    },
    {
      icon: 'musical-notes-outline',
      label: 'View Track',
      onPress: () => {
        // Handle view track
        onClose();
      },
    },
    {
      icon: 'share-social-outline',
      label: 'Share',
      onPress: () => {
        // Handle share
        onClose();
      },
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}>
        <View style={styles.menuContainer}>
          <View style={styles.header}>
            <Text style={styles.trackTitle}>{track.title}</Text>
            <Text style={styles.trackArtist}>{track.artist}</Text>
          </View>
          <View style={styles.optionsList}>
            {menuOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionItem}
                onPress={option.onPress}>
                <Icon name={option.icon} size={24} color="#fff" />
                <Text style={styles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#282828',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: Dimensions.get('window').height * 0.7,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  trackTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trackArtist: {
    color: '#b3b3b3',
    fontSize: 16,
  },
  optionsList: {
    padding: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
  },
  optionLabel: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
});

export default TrackOptionsMenu;