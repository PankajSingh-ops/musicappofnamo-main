
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Track } from '../../type';
import { useAuth } from '../../asyncStorage/AsyncStorage';

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
  const { user, token } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);

  const checkFavoriteStatus = useCallback(async () => {
    if (!user || !token) return;

    try {
      const response = await fetch(
        `http://10.0.2.2:3000/api/favorites/check/${track.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to check favorite status');
      }

      const data = await response.json();
      setIsFavorited(data.isFavorited);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      Alert.alert('Error', 'Failed to check favorite status');
    }
  }, [track.id, token, user]);

  const handleLike = async () => {
    if (!user || !token) {
      Alert.alert('Error', 'Please log in to add favorites');
      return;
    }

    try {
      const method = isFavorited ? 'DELETE' : 'POST';
      const url = isFavorited
        ? `http://10.0.2.2:3000/api/favorites/${track.id}`
        : 'http://10.0.2.2:3000/api/favorites';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: method === 'POST' ? JSON.stringify({ musicId: track.id }) : undefined,
      });

      if (!response.ok) {
        throw new Error('Failed to update favorite');
      }

      const data = await response.json();
      setIsFavorited(!isFavorited);
      Alert.alert('Success', data.message);
      onClose();
    } catch (error) {
      console.error('Error updating favorite:', error);
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const menuOptions = [
    {
      icon: isFavorited ? 'heart' : 'heart-outline',
      label: isFavorited ? 'Unlike' : 'Like',
      onPress: handleLike,
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

  React.useEffect(() => {
    if (visible && user) {
      checkFavoriteStatus();
    }
  }, [visible, user, checkFavoriteStatus]);

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