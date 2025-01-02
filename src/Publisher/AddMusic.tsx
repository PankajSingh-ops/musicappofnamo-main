import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import {useAuth} from '../../asyncStorage/AsyncStorage';

const AddMusic = () => {
  const {token, user} = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    artwork: null,
    duration: '',
    url: null,
    userId: user?.id.toString(),
    tags: '',
    genre: 'Rock',
    availability: 'public',
    allowDownload: 'no',
    displayEmbedCode: 'no',
    ageRestriction: 'All Ages',
    lyrics: '',
  });

  const [selectedFileName, setSelectedFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    artwork: 0,
    audio: 0,
  });

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Title is required');
      return false;
    }
    if (!formData.artist.trim()) {
      Alert.alert('Error', 'Artist name is required');
      return false;
    }
    if (!formData.artwork) {
      Alert.alert('Error', 'Artwork is required');
      return false;
    }
    if (!formData.url) {
      Alert.alert('Error', 'Music file is required');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });

      if (result.assets && result.assets[0]) {
        setFormData({...formData, artwork: result.assets[0].uri});
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });

      if (result[0]) {
        setFormData({...formData, url: result[0].uri});
        setSelectedFileName(result[0].name || 'Selected audio file');
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Failed to pick audio file');
      }
    }
  };

  const isFormComplete = () => {
    return (
      formData.title.trim() &&
      formData.artist.trim() &&
      formData.artwork &&
      formData.url
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Create form data for artwork
      const artworkForm = new FormData();
      artworkForm.append('file', {
        uri: formData.artwork,
        type: 'image/jpeg',
        name: 'artwork.jpg',
      });

      // Upload artwork with progress
      const artworkRes = await axios.post(
        'http://10.0.2.2:3000/api/music/upload/image',
        artworkForm,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({...prev, artwork: progress}));
          },
        },
      );

      // Create form data for audio
      const audioForm = new FormData();
      audioForm.append('file', {
        uri: formData.url,
        type: 'audio/mpeg',
        name: 'song.mp3',
      });

      // Upload audio with progress
      const audioRes = await axios.post(
        'http://10.0.2.2:3000/api/music/upload/audio',
        audioForm,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({...prev, audio: progress}));
          },
        },
      );

      // Submit final data
      const submitData = {
        ...formData,
        artwork: artworkRes.data.url,
        url: audioRes.data.url,
      };

      await axios.post('http://10.0.2.2:3000/api/music', submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      Alert.alert('Success', 'Music uploaded successfully');
      
      // Reset form and progress
      setFormData({
        title: '',
        artist: '',
        artwork: null,
        duration: '',
        url: null,
        userId: user?.id.toString(),
        tags: '',
        genre: 'Rock',
        availability: 'public',
        allowDownload: 'no',
        displayEmbedCode: 'no',
        ageRestriction: 'All Ages',
        lyrics: '',
      });
      setSelectedFileName('');
      setUploadProgress({ artwork: 0, audio: 0 });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to upload music');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add New Music</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={[styles.input, !formData.title.trim() && styles.inputRequired]}
          value={formData.title}
          onChangeText={text => setFormData({...formData, title: text})}
          placeholder="Enter song title"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Artist *</Text>
        <TextInput
          style={[styles.input, !formData.artist.trim() && styles.inputRequired]}
          value={formData.artist}
          onChangeText={text => setFormData({...formData, artist: text})}
          placeholder="Enter artist name"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Lyrics</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.lyrics}
          onChangeText={text => setFormData({...formData, lyrics: text})}
          placeholder="Enter song lyrics (optional)"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Artwork *</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>Choose Artwork</Text>
        </TouchableOpacity>
        {formData.artwork && (
          <>
            <Image source={{uri: formData.artwork}} style={styles.preview} />
            {uploadProgress.artwork > 0 && uploadProgress.artwork < 100 && (
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${uploadProgress.artwork}%` }]} />
                <Text style={styles.progressText}>{uploadProgress.artwork}%</Text>
              </View>
            )}
          </>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Music File *</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickAudio}>
          <Text style={styles.uploadButtonText}>Choose Audio File</Text>
        </TouchableOpacity>
        {selectedFileName ? (
  <View style={styles.fileInfo}>
    <View style={styles.fileDetails}>
      <Text style={styles.fileName}>{selectedFileName}</Text>
      <Text style={styles.fileType}>
        {selectedFileName.split('.').pop().toUpperCase()} file
      </Text>
    </View>
    {uploadProgress.audio > 0 && uploadProgress.audio < 100 && (
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${uploadProgress.audio}%` }]} />
        <Text style={styles.progressText}>{uploadProgress.audio}%</Text>
      </View>
    )}
  </View>
) : null}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Genre</Text>
        <View style={styles.picker}>
          {['Rock', 'Single', 'Spiritual', 'Pop'].map(genre => (
            <TouchableOpacity
              key={genre}
              style={[
                styles.pickerItem,
                formData.genre === genre && styles.pickerItemActive,
              ]}
              onPress={() => setFormData({...formData, genre})}>
              <Text
                style={[
                  styles.pickerItemText,
                  formData.genre === genre && styles.pickerItemTextActive,
                ]}>
                {genre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
  <Text style={styles.label}>Allow Downloads</Text>
  <View style={styles.picker}>
    {['yes', 'no'].map(option => (
      <TouchableOpacity
        key={option}
        style={[
          styles.pickerItem,
          formData.allowDownload === option && styles.pickerItemActive,
        ]}
        onPress={() => setFormData({...formData, allowDownload: option})}>
        <Text
          style={[
            styles.pickerItemText,
            formData.allowDownload === option && styles.pickerItemTextActive,
          ]}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</View>

<View style={styles.formGroup}>
  <Text style={styles.label}>Display Embed Code</Text>
  <View style={styles.picker}>
    {['yes', 'no'].map(option => (
      <TouchableOpacity
        key={option}
        style={[
          styles.pickerItem,
          formData.displayEmbedCode === option && styles.pickerItemActive,
        ]}
        onPress={() => setFormData({...formData, displayEmbedCode: option})}>
        <Text
          style={[
            styles.pickerItemText,
            formData.displayEmbedCode === option && styles.pickerItemTextActive,
          ]}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</View>


      <View style={styles.formGroup}>
        <Text style={styles.label}>Tags</Text>
        <TextInput
          style={styles.input}
          value={formData.tags}
          onChangeText={text => setFormData({...formData, tags: text})}
          placeholder="Enter tags separated by commas"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Age Restriction</Text>
        <View style={styles.picker}>
          {['All Ages', 'Only 18 +'].map(age => (
            <TouchableOpacity
              key={age}
              style={[
                styles.pickerItem,
                formData.ageRestriction === age && styles.pickerItemActive,
              ]}
              onPress={() => setFormData({...formData, ageRestriction: age})}>
              <Text
                style={[
                  styles.pickerItemText,
                  formData.ageRestriction === age &&
                    styles.pickerItemTextActive,
                ]}>
                {age}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Availability</Text>
        <View style={styles.picker}>
          {['public', 'private'].map(availability => (
            <TouchableOpacity
              key={availability}
              style={[
                styles.pickerItem,
                formData.availability === availability &&
                  styles.pickerItemActive,
              ]}
              onPress={() => setFormData({...formData, availability})}>
              <Text
                style={[
                  styles.pickerItemText,
                  formData.availability === availability &&
                    styles.pickerItemTextActive,
                ]}>
                {availability.charAt(0).toUpperCase() + availability.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
  style={[
    styles.submitButton,
    (loading || !isFormComplete()) && styles.submitButtonDisabled
  ]}
  onPress={handleSubmit}
  disabled={loading || !isFormComplete()}>
  <Text style={styles.submitButtonText}>
    {loading ? 'Uploading...' : 'Upload Music'}
  </Text>
</TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  fileInfo: {
    marginTop: 10,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
  },
  fileDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileName: {
    color: 'white',
    flex: 1,
  },
  fileType: {
    color: '#B62D25',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  uploadButton: {
    backgroundColor: '#B62D25',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  preview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 8,
  },
  picker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pickerItem: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 80,
    alignItems: 'center',
  },
  pickerItemActive: {
    backgroundColor: '#B62D25',
    borderColor: '#B62D25',
  },
  pickerItemText: {
    color: 'white',
  },
  pickerItemTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#B62D25',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputRequired: {
    borderColor: '#ff0000',
  },
  progressBar: {
    height: 20,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#B62D25',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressText: {
    color: 'white',
    textAlign: 'center',
    lineHeight: 20,
    zIndex: 1,
  },
});

export default AddMusic;
