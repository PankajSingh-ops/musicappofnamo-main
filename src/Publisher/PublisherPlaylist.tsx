import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
  FlatList,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {ActionSheetOption, Playlist} from '../../type';
import * as ImagePicker from 'react-native-image-picker';
import styles from './Css/PublisherPlaylistCss';
import {useAuth} from '../../asyncStorage/AsyncStorage';

interface UserProfile {
  name: string;
  imageUrl: string;
  totalPlaylists: number;
  followers: number;
}

const API_URL = 'http://10.0.2.2:3000/api';

const PublisherPlaylist = () => {
  const navigation = useNavigation();
  const {token} = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null,
  );
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [userProfile] = useState<UserProfile>({
    name: 'Sarah Wilson',
    imageUrl:
      'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=600',
    totalPlaylists: 12,
    followers: 2453,
  });

  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await fetch(`${API_URL}/playlists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch playlists');
      const data = await response.json();
      console.log(data, 'playlistData');

      setPlaylists(data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      Alert.alert('Error', 'Failed to load playlists');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPlaylists();
    setRefreshing(false);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });

      if (result.assets && result.assets[0]?.uri) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const createNewPlaylist = async () => {
    if (!newPlaylistName.trim()) {
      Alert.alert('Error', 'Please enter a playlist name');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;
      if (selectedImage) {
        // Create form data for image upload
        const imageFormData = new FormData();
        imageFormData.append('file', {
          uri: selectedImage,
          type: 'image/jpeg',
          name: 'playlist-cover.jpg',
        });

        // Upload image first
        const imageResponse = await fetch(`${API_URL}/playlists/upload/image`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          body: imageFormData,
        });

        if (!imageResponse.ok) {
          const errorData = await imageResponse.json();
          throw new Error(errorData.error || 'Failed to upload image');
        }

        const imageData = await imageResponse.json();
        if (!imageData.url) {
          throw new Error('No image URL received from server');
        }
        imageUrl = imageData.url;

        // Verify image URL is accessible
        const imageCheck = await fetch(imageUrl);
        if (!imageCheck.ok) {
          throw new Error('Uploaded image URL is not accessible');
        }
      }

      const playlistResponse = await fetch(`${API_URL}/playlists`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newPlaylistName,
          imageUrl,
        }),
      });

      if (!playlistResponse.ok) {
        const errorData = await playlistResponse.json();
        throw new Error(errorData.error || 'Failed to create playlist');
      }

      const newPlaylist = await playlistResponse.json();
      setPlaylists(prevPlaylists => [...prevPlaylists, newPlaylist]);
      resetForm();
      setModalVisible(false);
    } catch (error) {
      console.error('Error creating playlist:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create playlist. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const editPlaylist = async () => {
    if (!selectedPlaylist || !newPlaylistName.trim()) return;

    setLoading(true);
    try {
      let imageUrl = selectedPlaylist.imageUrl;
      if (selectedImage && selectedImage !== selectedPlaylist.imageUrl) {
        const imageFormData = new FormData();
        imageFormData.append('file', {
          uri: selectedImage,
          type: 'image/jpeg',
          name: 'playlist-cover.jpg',
        });

        const imageResponse = await fetch(`${API_URL}/playlists/upload/image`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: imageFormData,
        });

        if (!imageResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const imageData = await imageResponse.json();
        imageUrl = imageData.url;
      }

      const response = await fetch(
        `${API_URL}/playlists/${selectedPlaylist.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newPlaylistName,
            imageUrl,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update playlist');
      }

      const updatedPlaylist = await response.json();
      setPlaylists(prevPlaylists =>
        prevPlaylists.map(playlist =>
          playlist.id === selectedPlaylist.id ? updatedPlaylist : playlist,
        ),
      );
      resetForm();
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error updating playlist:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to update playlist. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const deletePlaylist = async (playlist: Playlist) => {
    Alert.alert(
      'Delete Playlist',
      `Are you sure you want to delete "${playlist.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_URL}/playlists/${playlist.id}`,
                {
                  method: 'DELETE',
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete playlist');
              }

              setPlaylists(prevPlaylists =>
                prevPlaylists.filter(p => p.id !== playlist.id),
              );
            } catch (error) {
              console.error('Error deleting playlist:', error);
              Alert.alert(
                'Error',
                error.message || 'Failed to delete playlist. Please try again.',
              );
            }
          },
        },
      ],
    );
  };

  const resetForm = () => {
    setNewPlaylistName('');
    setSelectedImage(null);
    setSelectedPlaylist(null);
  };

  const handlePlaylistPress = (playlist: Playlist) => {
    navigation.navigate('PlaylistDetails', {playlist});
  };

  const showActionSheet = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setActionSheetVisible(true);
  };

  const hideActionSheet = () => {
    setActionSheetVisible(false);
    setSelectedPlaylist(null);
  };

  const PlaylistModal = ({
    visible,
    onClose,
    onSubmit,
    title,
    submitText,
  }: {
    visible: boolean;
    onClose: () => void;
    onSubmit: () => Promise<void>;
    title: string;
    submitText: string;
  }) => {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}>
        <TouchableWithoutFeedback>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <TouchableOpacity
                      style={styles.modalCloseButton}
                      onPress={onClose}>
                      <Icon name="close" size={24} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.imagePickerContainer}
                    onPress={pickImage}>
                    {selectedImage ? (
                      <Image
                        source={{uri: selectedImage}}
                        style={styles.selectedImage}
                        resizeMode="cover"
                        onError={() => {
                          Alert.alert('Error', 'Failed to load image');
                          setSelectedImage(null);
                        }}
                      />
                    ) : (
                      <>
                        <Icon
                          name="add-photo-alternate"
                          size={40}
                          color="#666"
                        />
                        <Text style={styles.imagePickerText}>
                          Add Cover Image
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <TextInput
                    style={styles.input}
                    placeholder="Playlist name"
                    value={newPlaylistName}
                    onChangeText={setNewPlaylistName}
                    placeholderTextColor="#666"
                    returnKeyType="done"
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    onFocus={() => setModalVisible(true)}
                  />

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={onClose}
                      disabled={loading}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.createButton]}
                      onPress={onSubmit}
                      disabled={loading}>
                      {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <Text style={styles.createButtonText}>
                          {submitText}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };
  const ActionSheet = () => {
    if (!selectedPlaylist) return null;

    const options: ActionSheetOption[] = [
      {
        icon: 'edit',
        label: 'Edit Playlist',
        onPress: () => {
          setNewPlaylistName(selectedPlaylist.name);
          setSelectedImage(selectedPlaylist.imageUrl);
          setEditModalVisible(true);
          hideActionSheet();
        },
      },
      {
        icon: 'delete',
        label: 'Delete Playlist',
        onPress: () => {
          deletePlaylist(selectedPlaylist);
          hideActionSheet();
        },
        type: 'danger',
      },
    ];

    return (
      <Modal
        visible={actionSheetVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={hideActionSheet}>
        <TouchableOpacity
          style={styles.actionSheetOverlay}
          activeOpacity={1}
          onPress={hideActionSheet}>
          <View style={styles.actionSheetContainer}>
            <View style={styles.actionSheetHeader}>
              <Text style={styles.actionSheetTitle}>
                {selectedPlaylist.name}
              </Text>
              <Text style={styles.actionSheetSubtitle}>
                {selectedPlaylist.totalSongs} songs • {selectedPlaylist.creator}
              </Text>
            </View>
            <View style={styles.actionSheetOptions}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.actionSheetOption}
                  onPress={option.onPress}>
                  <Icon
                    name={option.icon}
                    size={24}
                    color={option.type === 'danger' ? '#E72F2E' : '#fff'}
                  />
                  <Text
                    style={[
                      styles.actionSheetOptionText,
                      option.type === 'danger' &&
                        styles.actionSheetOptionDanger,
                    ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.actionSheetCancelButton}
              onPress={hideActionSheet}>
              <Text style={styles.actionSheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const HeaderComponent = () => (
    <View style={styles.headerContainer}>
      <View style={styles.profileSection}>
        <Image
          source={{uri: userProfile.imageUrl}}
          style={styles.profileImage}
          defaultSource={require('../../assests/logo/logo.png')}
        />
        <Text style={styles.profileName}>{userProfile.name}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{userProfile.totalPlaylists}</Text>
            <Text style={styles.statLabel}>Playlists</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {userProfile.followers.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </View>
      </View>

      <View style={styles.playlistHeaderSection}>
        <Text style={styles.sectionTitle}>Your Playlists</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}>
          <Icon name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPlaylistItem = ({item}: {item: Playlist}) => (
    <TouchableOpacity
      style={styles.playlistCard}
      onPress={() => handlePlaylistPress(item)}>
      <Image
        source={{uri: item.imageUrl}}
        style={styles.playlistImage}
        defaultSource={require('../../assests/logo/logo.png')}
      />
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistName}>{item.name}</Text>
        <Text style={styles.playlistDetails}>
          {item.totalSongs} songs • {item.creator}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => showActionSheet(item)}>
        <Icon name="more-vert" size={24} color="#b3b3b3" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={playlists}
        renderItem={renderPlaylistItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.playlistsContainer}
        ListHeaderComponent={HeaderComponent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        keyboardShouldPersistTaps="handled"
      />

      <PlaylistModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          resetForm();
        }}
        onSubmit={createNewPlaylist}
        title="Create New Playlist"
        submitText="Create"
      />

      <PlaylistModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          resetForm();
        }}
        onSubmit={editPlaylist}
        title="Edit Playlist"
        submitText="Save"
      />

      <ActionSheet />
    </SafeAreaView>
  );
};

export default PublisherPlaylist;
