import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Track} from '../../type';
import {useAuth} from '../../asyncStorage/AsyncStorage';
import AddToPlaylistModal from '../PlaylistDetails/AddToPlaylist';
import { useTrackOptionsStore } from '../../store/useTrackOptionStore';
import styles from './Css/TrackOptionsCss';

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
  const {user, token} = useAuth();
  const {
    isFavorited,
    downloadProgress,
    showPlaylistModal,
    setShowPlaylistModal,
    checkFavoriteStatus,
    handleLike,
    handleDownload,
  } = useTrackOptionsStore();

  const menuOptions = [
    {
      icon: isFavorited ? 'heart' : 'heart-outline',
      label: isFavorited ? 'Unlike' : 'Like',
      onPress: () => handleLike(track, token),
    },
    {
      icon: 'add-circle-outline',
      label: 'Add to Playlist',
      onPress: () => setShowPlaylistModal(true),
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
      icon: 'download-outline',
      label:
        downloadProgress > 0
          ? `Downloading ${downloadProgress.toFixed(0)}%`
          : 'Download Song',
      onPress: () => handleDownload(track, token),
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

  useEffect(() => {
    if (visible && user && token) {
      checkFavoriteStatus(track, token);
    }
  }, [visible, user, token, track]);

  return (
    <>
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
                  {option.label.includes('Downloading') && (
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progress,
                          {width: `${downloadProgress}%`},
                        ]}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <AddToPlaylistModal
        visible={showPlaylistModal}
        onClose={() => {
          setShowPlaylistModal(false);
          onClose();
        }}
        trackId={track.id}
      />
    </>
  );
};



export default TrackOptionsMenu;