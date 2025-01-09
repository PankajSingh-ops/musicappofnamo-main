import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../asyncStorage/AsyncStorage';
import Toast from 'react-native-toast-message';

interface Playlist {
  id: number;
  name: string;
  imageUrl: string | null;
  creator: string;
  totalSongs: number;
}

interface OptionsModalState {
  visible: boolean;
  playlist: Playlist | null;
}

interface PlaylistModalState {
  visible: boolean;
  mode: 'create' | 'edit';
  playlist?: Playlist;
}

const PlaylistScreen: React.FC = () => {
  const navigation = useNavigation();
  const { token } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [playlistModal, setPlaylistModal] = useState<PlaylistModalState>({
    visible: false,
    mode: 'create'
  });
  const [playlistName, setPlaylistName] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [optionsModal, setOptionsModal] = useState<OptionsModalState>({ visible: false, playlist: null });

  useEffect(() => {
    fetchPlaylists();
  }, [token]);

  const showToast = (type: 'success' | 'error' | 'info', text1: string, text2?: string): void => {
    Toast.show({
      type,
      text1,
      text2,
      position: 'bottom',
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  const fetchPlaylists = async (): Promise<void> => {
    try {
      const response = await axios.get<Playlist[]>('http://10.0.2.2:3000/api/playlists', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlaylists(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      showToast('error', 'Error', 'Failed to fetch playlists');
      setLoading(false);
    }
  };

  const pickImage = async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 1,
        includeBase64: false,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        throw new Error(result.errorMessage || 'Failed to pick image');
      }

      if (result.assets && result.assets[0]?.uri) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleModalOpen = (mode: 'create' | 'edit', playlist?: Playlist) => {
    setPlaylistModal({ visible: true, mode, playlist });
    if (mode === 'edit' && playlist) {
      setPlaylistName(playlist.name);
      setSelectedImage(playlist.imageUrl);
    } else {
      setPlaylistName('');
      setSelectedImage(null);
    }
  };

  const handleModalClose = () => {
    setPlaylistModal({ visible: false, mode: 'create' });
    setPlaylistName('');
    setSelectedImage(null);
  };

  const createPlaylist = async (): Promise<void> => {
    if (!playlistName.trim()) {
      showToast('error', 'Error', 'Please enter a playlist name');
      return;
    }

    try {
      let imageUrl = '';
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', {
          uri: selectedImage,
          type: 'image/jpeg',
          name: 'image.jpg',
        });

        const imageResponse = await axios.post(
          'http://10.0.2.2:3000/api/playlists/upload/image',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        imageUrl = imageResponse.data.url;
      }

      const response = await axios.post(
        'http://10.0.2.2:3000/api/playlists',
        {
          name: playlistName,
          imageUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPlaylists([response.data, ...playlists]);
      handleModalClose();
      showToast('success', 'Success', 'Playlist created successfully');
    } catch (error) {
      console.error('Error creating playlist:', error);
      showToast('error', 'Error', 'Failed to create playlist');
    }
  };

  const updatePlaylist = async (): Promise<void> => {
    if (!playlistModal.playlist || !playlistName.trim()) {
      showToast('error', 'Error', 'Please enter a playlist name');
      return;
    }

    try {
      let imageUrl = playlistModal.playlist.imageUrl;
      if (selectedImage && selectedImage !== playlistModal.playlist.imageUrl) {
        const formData = new FormData();
        formData.append('file', {
          uri: selectedImage,
          type: 'image/jpeg',
          name: 'image.jpg',
        });

        const imageResponse = await axios.post(
          'http://10.0.2.2:3000/api/playlists/upload/image',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        imageUrl = imageResponse.data.url;
      }

      const response = await axios.put(
        `http://10.0.2.2:3000/api/playlists/${playlistModal.playlist.id}`,
        {
          name: playlistName,
          imageUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPlaylists(playlists.map(p => 
        p.id === playlistModal.playlist?.id ? response.data : p
      ));
      handleModalClose();
      showToast('success', 'Success', 'Playlist updated successfully');
    } catch (error) {
      console.error('Error updating playlist:', error);
      showToast('error', 'Error', 'Failed to update playlist');
    }
  };

  const deletePlaylist = async (playlistId: number): Promise<void> => {
    try {
      await axios.delete(`http://10.0.2.2:3000/api/playlists/${playlistId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlaylists(playlists.filter(playlist => playlist.id !== playlistId));
      setOptionsModal({ visible: false, playlist: null });
      showToast('success', 'Success', 'Playlist deleted successfully');
    } catch (error) {
      console.error('Error deleting playlist:', error);
      showToast('error', 'Error', 'Failed to delete playlist');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.playlistGrid}>
          <TouchableOpacity
            style={styles.createPlaylistButton}
            onPress={() => handleModalOpen('create')}
          >
            <Icon name="add" size={40} color="#FF0000" />
            <Text style={styles.createPlaylistText}>Create Playlist</Text>
          </TouchableOpacity>

          {playlists.map((playlist) => (
            <TouchableOpacity
              key={playlist.id}
              style={styles.playlistItem}
              onPress={() => navigation.navigate('PlaylistDetails', { playlist })}
            >
              <Image
                source={{ uri: playlist.imageUrl || 'https://via.placeholder.com/200' }}
                style={styles.playlistImage}
              />
              <Text style={styles.playlistName} numberOfLines={1}>
                {playlist.name}
              </Text>
              <Text style={styles.playlistInfo}>
                {playlist.totalSongs} songs
              </Text>
              <TouchableOpacity
                style={styles.moreButton}
                onPress={() => setOptionsModal({ visible: true, playlist })}
              >
                <Icon name="more-vert" size={24} color="#666" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Create/Edit Playlist Modal */}
      <Modal
        visible={playlistModal.visible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleModalClose}
            >
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              {playlistModal.mode === 'create' ? 'Create New Playlist' : 'Edit Playlist'}
            </Text>

            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.selectedImage}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Icon name="add-photo-alternate" size={40} color="#666" />
                  <Text style={styles.imagePlaceholderText}>Choose Image</Text>
                </View>
              )}
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Playlist Name"
              value={playlistName}
              onChangeText={setPlaylistName}
              placeholderTextColor="#666"
            />

            <TouchableOpacity
              style={[
                styles.createButton,
                !playlistName.trim() && styles.createButtonDisabled
              ]}
              onPress={playlistModal.mode === 'create' ? createPlaylist : updatePlaylist}
              disabled={!playlistName.trim()}
            >
              <Text style={styles.createButtonText}>
                {playlistModal.mode === 'create' ? 'Create Playlist' : 'Update Playlist'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Options Modal */}
      <Modal
        visible={optionsModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setOptionsModal({ visible: false, playlist: null })}
      >
        <TouchableOpacity
          style={styles.optionsModalContainer}
          activeOpacity={1}
          onPress={() => setOptionsModal({ visible: false, playlist: null })}
        >
          <View style={styles.optionsContent}>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setOptionsModal({ visible: false, playlist: null });
                handleModalOpen('edit', optionsModal.playlist!);
              }}
            >
              <Icon name="edit" size={24} color="#666" />
              <Text style={styles.optionText}>Edit Playlist</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionItem, styles.deleteOption]}
              onPress={() => optionsModal.playlist && deletePlaylist(optionsModal.playlist.id)}
            >
              <Icon name="delete" size={24} color="#FF0000" />
              <Text style={styles.deleteOptionText}>Delete Playlist</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  playlistGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  createPlaylistButton: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#111',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  createPlaylistText: {
    color: '#FF0000',
    marginTop: 8,
    fontSize: 14,
  },
  playlistItem: {
    width: '47%',
    marginBottom: 16,
  },
  playlistImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  playlistName: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
  playlistInfo: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  moreButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  imagePickerButton: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#222',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#666',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#FF0000',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#666',
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  optionsContent: {
    backgroundColor: '#111',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  optionText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 16,
  },
  deleteOption: {
    borderBottomWidth: 0,
  },
  deleteOptionText: {
    color: '#FF0000',
    fontSize: 16,
    marginLeft: 16,
  },
});

export default PlaylistScreen;