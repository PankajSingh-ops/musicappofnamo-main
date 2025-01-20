import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../../asyncStorage/AsyncStorage';
import styles from './css/PlayListScreenCss';
import usePlaylistStore from '../../store/usePlayList';

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
  const {token} = useAuth();
  const {
    playlists,
    loading,
    fetchPlaylists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
  } = usePlaylistStore();

  const [playlistModal, setPlaylistModal] = useState<PlaylistModalState>({
    visible: false,
    mode: 'create',
  });
  const [playlistName, setPlaylistName] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [optionsModal, setOptionsModal] = useState<OptionsModalState>({
    visible: false,
    playlist: null,
  });

  useEffect(() => {
    fetchPlaylists(token);
  }, [token]);

  const pickImage = async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 1,
        includeBase64: false,
      });

      if (result.didCancel) return;
      if (result.errorCode)
        throw new Error(result.errorMessage || 'Failed to pick image');
      if (result.assets && result.assets[0]?.uri)
        setSelectedImage(result.assets[0].uri);
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleModalOpen = (mode: 'create' | 'edit', playlist?: Playlist) => {
    setPlaylistModal({visible: true, mode, playlist});
    if (mode === 'edit' && playlist) {
      setPlaylistName(playlist.name);
      setSelectedImage(playlist.imageUrl);
    } else {
      setPlaylistName('');
      setSelectedImage(null);
    }
  };

  const handleModalClose = () => {
    setPlaylistModal({visible: false, mode: 'create'});
    setPlaylistName('');
    setSelectedImage(null);
  };

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) return;
    try {
        await createPlaylist(token, playlistName, selectedImage);
        handleModalClose();
    } catch (error) {
        console.error('Error in handleCreatePlaylist:', error);
    }
};

  const handleUpdatePlaylist = async () => {
    if (!playlistModal.playlist || !playlistName.trim()) return;
    try {
      await updatePlaylist(
        token,
        playlistModal.playlist.id,
        playlistName,
        selectedImage,
      );
      handleModalClose();
    } catch (error) {
      console.error('Error in handleUpdatePlaylist:', error);
    }
  };

  const handleDeletePlaylist = async (playlistId: number) => {
    try {
      await deletePlaylist(token, playlistId);
      setOptionsModal({visible: false, playlist: null});
    } catch (error) {
      console.error('Error in handleDeletePlaylist:', error);
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
            onPress={() => handleModalOpen('create')}>
            <Icon name="add" size={40} color="#FF0000" />
            <Text style={styles.createPlaylistText}>Create Playlist</Text>
          </TouchableOpacity>

          {playlists.map(playlist => (
            <TouchableOpacity
              key={playlist.id}
              style={styles.playlistItem}
              onPress={() =>
                navigation.navigate('PlaylistDetails', {playlist})
              }>
              <Image
                source={{
                  uri: playlist.imageUrl || 'https://via.placeholder.com/200',
                }}
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
                onPress={() => setOptionsModal({visible: true, playlist})}>
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
        onRequestClose={handleModalClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleModalClose}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              {playlistModal.mode === 'create'
                ? 'Create New Playlist'
                : 'Edit Playlist'}
            </Text>

            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={pickImage}>
              {selectedImage ? (
                <Image
                  source={{uri: selectedImage}}
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
                !playlistName.trim() && styles.createButtonDisabled,
              ]}
              onPress={
                playlistModal.mode === 'create'
                  ? handleCreatePlaylist
                  : handleUpdatePlaylist
              }
              disabled={!playlistName.trim()}>
              <Text style={styles.createButtonText}>
                {playlistModal.mode === 'create'
                  ? 'Create Playlist'
                  : 'Update Playlist'}
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
        onRequestClose={() =>
          setOptionsModal({visible: false, playlist: null})
        }>
        <TouchableOpacity
          style={styles.optionsModalContainer}
          activeOpacity={1}
          onPress={() => setOptionsModal({visible: false, playlist: null})}>
          <View style={styles.optionsContent}>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setOptionsModal({visible: false, playlist: null});
                handleModalOpen('edit', optionsModal.playlist!);
              }}>
              <Icon name="edit" size={24} color="#666" />
              <Text style={styles.optionText}>Edit Playlist</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionItem, styles.deleteOption]}
              onPress={() =>
                optionsModal.playlist &&
                handleDeletePlaylist(optionsModal.playlist.id)
              }>
              <Icon name="delete" size={24} color="#FF0000" />
              <Text style={styles.deleteOptionText}>Delete Playlist</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default PlaylistScreen;
