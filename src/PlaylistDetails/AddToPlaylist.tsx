import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../asyncStorage/AsyncStorage';

interface AddToPlaylistModalProps {
  visible: boolean;
  onClose: () => void;
  trackId: number|string;
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
  const { token } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchPlaylists();
    }
  }, [visible]);

  const fetchPlaylists = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3000/api/playlists', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch playlists');
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      Alert.alert('Error', 'Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      Alert.alert('Error', 'Please enter a playlist name');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('http://10.0.2.2:3000/api/playlists', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newPlaylistName,
        }),
      });

      if (!response.ok) throw new Error('Failed to create playlist');
      
      const newPlaylist = await response.json();
      setPlaylists([newPlaylist, ...playlists]);
      setShowCreateNew(false);
      setNewPlaylistName('');
      
      // Add track to the newly created playlist
      await addTrackToPlaylist(newPlaylist.id);
    } catch (error) {
      console.error('Error creating playlist:', error);
      Alert.alert('Error', 'Failed to create playlist');
    } finally {
      setCreating(false);
    }
  };

  const addTrackToPlaylist = async (playlistId: number) => {
    try {
      const response = await fetch(`http://10.0.2.2:3000/api/playlists/${playlistId}/songs`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songId: trackId }),
      });

      if (!response.ok) throw new Error('Failed to add track to playlist');
      
      Alert.alert('Success', 'Track added to playlist');
      onClose();
    } catch (error) {
      console.error('Error adding track to playlist:', error);
      Alert.alert('Error', 'Failed to add track to playlist');
    }
  };

  const renderPlaylist = ({ item }: { item: Playlist }) => (
    <TouchableOpacity
      style={styles.playlistItem}
      onPress={() => addTrackToPlaylist(item.id)}>
      <View style={styles.playlistInfo}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.playlistImage} />
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
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#282828',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: Dimensions.get('window').height * 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  createNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  createNewText: {
    color: '#ff0000',
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '600',
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'space-between',
  },
  playlistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playlistImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  placeholderImage: {
    backgroundColor: '#404040',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistDetails: {
    marginLeft: 15,
    flex: 1,
  },
  playlistName: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  songCount: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 20,
  },
  loader: {
    padding: 20,
  },
  createNewSection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  input: {
    backgroundColor: '#404040',
    color: '#fff',
    padding: 12,
    borderRadius: 4,
    marginBottom: 15,
  },
  createButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#404040',
  },
  createButton: {
    backgroundColor: '#ff0000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AddToPlaylistModal;