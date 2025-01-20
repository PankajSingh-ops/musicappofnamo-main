import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useAuth} from '../../asyncStorage/AsyncStorage';
import styles from './css/AddToPlaylist';
import usePlaylistStore from '../../store/usePlayList';

interface AddToPlaylistModalProps {
  visible: boolean;
  onClose: () => void;
  trackId: number | string;
}

interface Playlist {
  id: number;
  name: string;
  imageUrl: string;
  totalSongs: number;
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  visible,
  onClose,
  trackId,
}) => {
  const {token} = useAuth();
  const {
    playlists,
    loading,
    creating,
    fetchPlaylists,
    createPlaylist,
    addTrackToPlaylist,
  } = usePlaylistStore();

  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    if (visible) {
      fetchPlaylists(token);
    }
  }, [visible, token, fetchPlaylists]);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      Alert.alert('Error', 'Please enter a playlist name');
      return;
    }

    try {
      await createPlaylist(token, newPlaylistName, trackId);
      setShowCreateNew(false);
      setNewPlaylistName('');
      Alert.alert('Success', 'Playlist created and track added');
      onClose();
    } catch (error) {
      console.error('Error creating playlist:', error);
      Alert.alert('Error', 'Failed to create playlist');
    }
  };

  const handleAddToPlaylist = async (playlistId: number) => {
    try {
      await addTrackToPlaylist(token, playlistId, trackId);
      Alert.alert('Success', 'Track added to playlist');
      onClose();
    } catch (error) {
      console.error('Error adding track to playlist:', error);
      Alert.alert('Error', 'Failed to add track to playlist');
    }
  };

  const renderPlaylist = ({item}: {item: Playlist}) => (
    <TouchableOpacity
      style={styles.playlistItem}
      onPress={() => handleAddToPlaylist(item.id)}>
      <View style={styles.playlistInfo}>
        {item.imageUrl ? (
          <Image source={{uri: item.imageUrl}} style={styles.playlistImage} />
        ) : (
          <View style={[styles.playlistImage, styles.placeholderImage]}>
            <Icon name="musical-notes" size={24} color="#666" />
          </View>
        )}
        <View style={styles.playlistDetails}>
          <Text style={styles.playlistName}>{item.name}</Text>
          <Text style={styles.songCount}>{item.totalSongs} songs</Text>
        </View>
      </View>
      <Icon name="add-circle" size={24} color="#ff0000" />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Add to Playlist</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {showCreateNew ? (
            <View style={styles.createNewSection}>
              <TextInput
                style={styles.input}
                placeholder="Playlist name"
                placeholderTextColor="#666"
                value={newPlaylistName}
                onChangeText={setNewPlaylistName}
              />
              <View style={styles.createButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setShowCreateNew(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.createButton]}
                  onPress={handleCreatePlaylist}
                  disabled={creating}>
                  {creating ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Create</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.createNewButton}
              onPress={() => setShowCreateNew(true)}>
              <Icon name="add-circle-outline" size={24} color="#ff0000" />
              <Text style={styles.createNewText}>Create New Playlist</Text>
            </TouchableOpacity>
          )}

          {loading ? (
            <ActivityIndicator color="#ff0000" style={styles.loader} />
          ) : (
            <FlatList
              data={playlists}
              renderItem={renderPlaylist}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default AddToPlaylistModal;
