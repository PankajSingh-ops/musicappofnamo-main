import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Track} from '../../type';
import {useAuth} from '../../asyncStorage/AsyncStorage';
import AddToPlaylistModal from '../PlaylistDetails/AddToPlaylist';
import { useTrackOptionsStore } from '../../store/useTrackOptionStore';

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
    flex: 1,
  },
  progressBar: {
    height: 2,
    backgroundColor: '#404040',
    borderRadius: 1,
    marginTop: 8,
    width: '100%',
  },
  progress: {
    height: '100%',
    backgroundColor: '#1DB954',
    borderRadius: 1,
  },
});

export default TrackOptionsMenu;