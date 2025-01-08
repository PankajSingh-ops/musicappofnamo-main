import React, {useState} from 'react';
import {
  StyleSheet,
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {ActionSheetOption, Playlist} from '../../type';

interface UserProfile {
  name: string;
  imageUrl: string;
  totalPlaylists: number;
  followers: number;
}

const PublisherPlaylist = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null,
  );
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  // Sample user data
  const [userProfile] = useState<UserProfile>({
    name: 'Sarah Wilson',
    imageUrl:
      'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=600',
    totalPlaylists: 12,
    followers: 2453,
  });

  // Sample playlists data
  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: '1',
      name: 'My Favorite Hits',
      imageUrl:
        'https://i.pinimg.com/736x/cd/6c/8f/cd6c8f834fce26428e62a46d2c27357b.jpg',
      totalSongs: 45,
      creator: 'Sarah Wilson',
    },
    {
      id: '2',
      name: 'Workout Mix',
      imageUrl:
        'https://i.pinimg.com/736x/cd/6c/8f/cd6c8f834fce26428e62a46d2c27357b.jpg',
      totalSongs: 32,
      creator: 'Sarah Wilson',
    },
    {
      id: '3',
      name: 'Chill Vibes',
      imageUrl:
        'https://i.pinimg.com/736x/cd/6c/8f/cd6c8f834fce26428e62a46d2c27357b.jpg',
      totalSongs: 28,
      creator: 'Sarah Wilson',
    },
  ]);

  const showActionSheet = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setActionSheetVisible(true);
  };

  const hideActionSheet = () => {
    setActionSheetVisible(false);
    setSelectedPlaylist(null);
  };

  const createNewPlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist: Playlist = {
        id: Date.now().toString(),
        name: newPlaylistName,
        imageUrl: 'https://example.com/placeholder.jpg',
        totalSongs: 0,
        creator: userProfile.name,
      };

      setPlaylists([...playlists, newPlaylist]);
      setNewPlaylistName('');
      setModalVisible(false);
    }
  };

  const editPlaylist = () => {
    if (selectedPlaylist && newPlaylistName.trim()) {
      const updatedPlaylists = playlists.map(playlist =>
        playlist.id === selectedPlaylist.id
          ? {...playlist, name: newPlaylistName}
          : playlist,
      );
      setPlaylists(updatedPlaylists);
      setEditModalVisible(false);
      setNewPlaylistName('');
      setSelectedPlaylist(null);
    }
  };

  const deletePlaylist = (playlist: Playlist) => {
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
          onPress: () => {
            const updatedPlaylists = playlists.filter(
              p => p.id !== playlist.id,
            );
            setPlaylists(updatedPlaylists);
          },
        },
      ],
    );
  };

  const handlePlaylistPress = (playlist: Playlist) => {
    navigation.navigate('PlaylistDetails', {playlist});
  };

  const ActionSheet = () => {
    if (!selectedPlaylist) return null;

    const options: ActionSheetOption[] = [
      {
        icon: 'edit',
        label: 'Edit Playlist',
        onPress: () => {
          setNewPlaylistName(selectedPlaylist.name);
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
          {item.totalSongs} songs - {item.creator}
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
      />

      {/* Create Playlist Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Playlist</Text>
            <TextInput
              style={styles.input}
              placeholder="Playlist name"
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              placeholderTextColor="#666"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={createNewPlaylist}>
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Playlist Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Playlist</Text>
            <TextInput
              style={styles.input}
              placeholder="Playlist name"
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              placeholderTextColor="#666"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={editPlaylist}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ActionSheet />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  menuOptions: {
    position: 'absolute',
    right: 48,
    top: 16,
    backgroundColor: '#333',
    borderRadius: 8,
    elevation: 5,
    padding: 8,
  },
  actionSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  actionSheetContainer: {
    backgroundColor: '#282828',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Add extra padding for iPhone home indicator
  },
  actionSheetHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#383838',
  },
  actionSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  actionSheetSubtitle: {
    fontSize: 14,
    color: '#b3b3b3',
  },
  actionSheetOptions: {
    paddingVertical: 8,
  },
  actionSheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionSheetOptionText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 16,
  },
  actionSheetOptionDanger: {
    color: '#E72F2E',
  },
  actionSheetCancelButton: {
    marginTop: 8,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#383838',
  },
  actionSheetCancelText: {
    fontSize: 16,
    color: '#b3b3b3',
    textAlign: 'center',
    fontWeight: '600',
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  menuText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  headerContainer: {
    backgroundColor: '#1a1a1a',
    paddingBottom: 16,
  },
  backButton: {
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#E72F2E',
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282828',
    padding: 16,
    borderRadius: 20,
    width: '80%',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#b3b3b3',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#404040',
  },
  playlistHeaderSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E72F2E',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  playlistsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  playlistCard: {
    flexDirection: 'row',
    backgroundColor: '#282828',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    alignItems: 'center',
  },
  playlistImage: {
    width: 80,
    height: 80,
  },
  playlistInfo: {
    flex: 1,
    padding: 16,
  },
  playlistName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  playlistDetails: {
    fontSize: 14,
    color: '#b3b3b3',
  },
  moreButton: {
    padding: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#282828',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
    padding: 16,
    color: '#fff',
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#404040',
  },
  createButton: {
    backgroundColor: '#E72F2E',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PublisherPlaylist;
