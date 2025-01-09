import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Track} from '../../type';
import {useAuth} from '../../asyncStorage/AsyncStorage';
import AddToPlaylistModal from '../PlaylistDetails/AddToPlaylist';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [isFavorited, setIsFavorited] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const checkPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to storage to download songs',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Permission error:', err);
        return false;
      }
    }
    return true;
  };

  const handleDownload = async () => {
    if (!user || !token) {
      Alert.alert('Error', 'Please log in to download songs');
      return;
    }

    // Check permissions first
    const hasPermission = await checkPermissions();
    if (!hasPermission) {
      Alert.alert('Error', 'Storage permission is required to download songs');
      return;
    }

    try {
      // First, request download permission from backend
      const response = await fetch(
        `http://10.0.2.2:3000/api/downloads/${track.id}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to initiate download');
      }

      const data = await response.json();

      // Get the app's private directory
      const {dirs} = RNFetchBlob.fs;
      const dirPath = Platform.select({
        ios: dirs.DocumentDir,
        android: dirs.DownloadDir,
      });

      // Create a sanitized filename
      const filename = `${track.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`;
      const filePath = `${dirPath}/MyMusicApp/${filename}`;

      // Ensure directory exists
      await RNFetchBlob.fs.mkdir(`${dirPath}/MyMusicApp`);

      // Start download
      const downloadTask = RNFetchBlob.config({
        path: filePath,
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: `Downloading ${track.title}`,
          description: 'Downloading song...',
          mime: 'audio/mpeg',
          mediaScannable: true,
          path: filePath,
        },
      }).fetch('GET', data.downloadUrl, {
        Authorization: `Bearer ${token}`,
      });

      downloadTask
        .progress((received, total) => {
          const progress = (received / total) * 100;
          setDownloadProgress(progress);
        })
        .then(async res => {
          // Save download info to AsyncStorage for offline access
          try {
            const downloads = await AsyncStorage.getItem('downloadedTracks');
            const downloadedTracks = downloads ? JSON.parse(downloads) : [];

            downloadedTracks.push({
              id: track.id,
              title: track.title,
              artist: track.artist,
              artwork: track.artwork,
              filePath: res.path(),
              downloadedAt: new Date().toISOString(),
            });

            await AsyncStorage.setItem(
              'downloadedTracks',
              JSON.stringify(downloadedTracks),
            );

            Alert.alert(
              'Success',
              'Song downloaded successfully! You can access it from the Downloads section.',
            );
          } catch (error) {
            console.error('Error saving download info:', error);
          }
        })
        .catch(error => {
          console.error('Download failed:', error);
          Alert.alert('Error', 'Failed to download the song');
        })
        .finally(() => {
          setDownloadProgress(0);
          onClose();
        });
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download the song');
      onClose();
    }
  };

  const checkFavoriteStatus = useCallback(async () => {
    if (!user || !token) return;

    try {
      const response = await fetch(
        `http://10.0.2.2:3000/api/favorites/check/${track.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
        body:
          method === 'POST' ? JSON.stringify({musicId: track.id}) : undefined,
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
        setShowPlaylistModal(true);
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
      icon: 'download-outline',
      label:
        downloadProgress > 0
          ? `Downloading ${downloadProgress.toFixed(0)}%`
          : 'Download Song',
      onPress: handleDownload,
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
                      <View style={[styles.progress, { width: `${downloadProgress}%` }]} />
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
