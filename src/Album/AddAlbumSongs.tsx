import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {launchImageLibrary} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';
import {useAuth} from '../../asyncStorage/AsyncStorage';

const API_URL = 'http://10.0.2.2:3000/api';

const CreateAlbumScreen = ({navigation}:any) => {
  const {token} = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    releaseDate: new Date(),
    coverImage: '',
    description: '',
    category: '',
    tags: '',
    genre: '',
    selectedSongs: [],
  });
  const [userSongs, setUserSongs] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchUserSongs();
  }, []);

  const fetchUserSongs = async () => {
    try {
      const response = await fetch(`${API_URL}/user-songs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUserSongs(data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 1000,
      maxWidth: 1000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
        return;
      }

      if (response.assets && response.assets[0]) {
        setFormData(prev => ({
          ...prev,
          coverImage: {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
          },
        }));
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();

      // Append all text fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('releaseDate', formData.releaseDate.toISOString());
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('genre', formData.genre);
      formDataToSend.append(
        'selectedSongs',
        JSON.stringify(formData.selectedSongs),
      );

      // Append cover image
      if (formData.coverImage) {
        formDataToSend.append('coverImage', formData.coverImage);
      }

      const response = await fetch(`${API_URL}/albums`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        navigation.navigate('Albums');
      }
    } catch (error) {
      console.error('Error creating album:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Album</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Album Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={text => setFormData(prev => ({...prev, name: text}))}
          placeholder="Enter album name"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Release Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateButtonText}>
            {formData.releaseDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={formData.releaseDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) {
                setFormData(prev => ({...prev, releaseDate: date}));
              }
            }}
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Cover Image</Text>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>
            {formData.coverImage ? 'Change Image' : 'Select Image'}
          </Text>
        </TouchableOpacity>
        {formData.coverImage && (
          <Image
            source={{uri: formData.coverImage.uri}}
            style={styles.previewImage}
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={text =>
            setFormData(prev => ({...prev, description: text}))
          }
          placeholder="Enter album description"
          placeholderTextColor="#666"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Genre</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.genre}
            onValueChange={value =>
              setFormData(prev => ({...prev, genre: value}))
            }
            style={styles.picker}
            dropdownIconColor="#fff">
            <Picker.Item label="Select Genre" value="" />
            <Picker.Item label="Rock" value="rock" />
            <Picker.Item label="Pop" value="pop" />
            <Picker.Item label="Hip Hop" value="hiphop" />
            <Picker.Item label="Jazz" value="jazz" />
            <Picker.Item label="Classical" value="classical" />
            <Picker.Item label="Electronic" value="electronic" />
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Tags (comma-separated)</Text>
        <TextInput
          style={styles.input}
          value={formData.tags}
          onChangeText={text => setFormData(prev => ({...prev, tags: text}))}
          placeholder="Enter tags"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Select Songs</Text>
        <ScrollView style={styles.songListContainer}>
          {userSongs.map(song => (
            <TouchableOpacity
              key={song.id}
              style={[
                styles.songItem,
                formData.selectedSongs.includes(song.id) && styles.selectedSong,
              ]}
              onPress={() => {
                setFormData(prev => ({
                  ...prev,
                  selectedSongs: prev.selectedSongs.includes(song.id)
                    ? prev.selectedSongs.filter(id => id !== song.id)
                    : [...prev.selectedSongs, song.id],
                }));
              }}>
              <Text style={styles.songTitle}>{song.title}</Text>
              <Text style={styles.songArtist}>{song.artist}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={
          !formData.name ||
          !formData.genre ||
          formData.selectedSongs.length === 0
        }>
        <Text style={styles.submitButtonText}>Create Album</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#ff0000',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff0000',
  },
  dateButtonText: {
    color: '#fff',
  },
  imageButton: {
    backgroundColor: '#ff0000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  pickerContainer: {
    backgroundColor: '#222',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff0000',
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
    height: 50,
  },
  songListContainer: {
    maxHeight: 200,
    backgroundColor: '#222',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff0000',
  },
  songItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  selectedSong: {
    backgroundColor: '#ff000033',
  },
  songTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  songArtist: {
    color: '#999',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#ff0000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateAlbumScreen;
