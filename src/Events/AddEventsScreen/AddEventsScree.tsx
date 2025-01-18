import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import {TextInput} from 'react-native-paper';
import {useAuth} from '../../../asyncStorage/AsyncStorage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './AddEventsScreenCss';
import {Event} from '../../../type';

const API_BASE_URL = 'http://10.0.2.2:3000/api';

const TIMEZONES = [
  'UTC',
  'GMT',
  'EST',
  'CST',
  'MST',
  'PST',
  'EDT',
  'CDT',
  'MDT',
  'PDT',
  'AKST',
  'HST',
];

const initialState: Event = {
  event_title: '',
  event_cover: '',
  event_location: 'online',
  location_url: '',
  start_date: new Date(),
  start_time: new Date(),
  end_date: new Date(),
  end_time: new Date(),
  timezone: '',
  sell_tickets: false,
  total_tickets: 0,
  ticket_price: 0,
  event_description: '',
  event_video: '',
};

const AddEventScreen: React.FC = () => {
  const {token} = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  const [showStartDate, setShowStartDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [localImageUri, setLocalImageUri] = useState<string>('');
  const [localVideoUri, setLocalVideoUri] = useState<string>('');
  const [videoFileName, setVideoFileName] = useState<string>('');
  const [imageFile, setImageFile] = useState<any>(null);
  const [videoFile, setVideoFile] = useState<any>(null);

  const [event, setEvent] = useState<Event>(initialState);

  const resetForm = () => {
    setEvent(initialState);
    setLocalImageUri('');
    setLocalVideoUri('');
    setVideoFileName('');
    setImageFile(null);
    setVideoFile(null);
  };

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });

      if (result.assets && result.assets[0].uri) {
        setLocalImageUri(result.assets[0].uri);
        setImageFile({
          uri: result.assets[0].uri,
          type: result.assets[0].type,
          name: result.assets[0].fileName,
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const clearImage = () => {
    setLocalImageUri('');
    setImageFile(null);
    setEvent(prev => ({...prev, event_cover: ''}));
  };

  const clearVideo = () => {
    setLocalVideoUri('');
    setVideoFile(null);
    setVideoFileName('');
    setEvent(prev => ({...prev, event_video: ''}));
  };

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });

      setLocalVideoUri(result[0].uri);
      setVideoFileName(result[0].name);
      setVideoFile({
        uri: result[0].uri,
        type: result[0].type,
        name: result[0].name,
      });
    } catch (error) {
      console.error('Error picking video:', error);
    }
  };

  const uploadFiles = async () => {
    try {
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('file', imageFile);

        const imageResponse = await axios.post(
          `${API_BASE_URL}/events/upload/cover`,
          imageFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setEvent(prev => ({...prev, event_cover: imageResponse.data.url}));
      }

      if (videoFile) {
        const videoFormData = new FormData();
        videoFormData.append('file', videoFile);

        const videoResponse = await axios.post(
          `${API_BASE_URL}/events/upload/video`,
          videoFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setEvent(prev => ({...prev, event_video: videoResponse.data.url}));
      }
    } catch (error) {
      throw new Error('Error uploading files');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setUploadLoading(true);

      await uploadFiles();

      const response = await axios.post(`${API_BASE_URL}/events`, event, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Event created:', response.data);
      resetForm();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
      setUploadLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Event</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>
          {localImageUri ? 'Change Event Cover' : 'Upload Event Cover'}
        </Text>
      </TouchableOpacity>

      {localImageUri && (
        <View style={styles.mediaPreviewContainer}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewLabel}>Image Preview:</Text>
            <TouchableOpacity onPress={clearImage}>
              <Icon name="close-circle" size={24} color="#CA2B28" />
            </TouchableOpacity>
          </View>
          <Image
            source={{uri: localImageUri}}
            style={styles.previewImage}
            resizeMode="cover"
          />
        </View>
      )}

      <TextInput
        mode="outlined"
        label="Event Title"
        value={event.event_title}
        onChangeText={text => setEvent(prev => ({...prev, event_title: text}))}
        style={styles.input}
        theme={{
          colors: {
            primary: '#CA2B28',
            text: '#FFFFFF',
            placeholder: '#FFFFFF',
          },
        }}
        textColor="#FFFFFF"
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Location Type</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={event.event_location}
            onValueChange={value =>
              setEvent(prev => ({...prev, event_location: value}))
            }
            style={[
              styles.picker,
              Platform.OS === 'ios' && {backgroundColor: '#1A1A1A'},
            ]}
            dropdownIconColor="#FFFFFF"
            itemStyle={{color: '#FFFFFF'}}>
            <Picker.Item label="Online" value="online" />
            <Picker.Item label="Physical Location" value="physical" />
          </Picker>
        </View>
      </View>

      {event.event_location === 'online' && (
        <TextInput
          mode="outlined"
          label="Event URL"
          value={event.location_url}
          onChangeText={text =>
            setEvent(prev => ({...prev, location_url: text}))
          }
          style={styles.input}
          theme={{
            colors: {
              primary: '#CA2B28',
              text: '#FFFFFF',
              placeholder: '#FFFFFF',
            },
          }}
          textColor="#FFFFFF"
        />
      )}

      <TouchableOpacity
        style={styles.dateTimeButton}
        onPress={() => setShowStartDate(true)}>
        <Text style={styles.dateTimeText}>
          Event Start Date: {formatDate(event.start_date)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dateTimeButton}
        onPress={() => setShowStartTime(true)}>
        <Text style={styles.dateTimeText}>
          Event Start Time: {formatTime(event.start_time)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dateTimeButton}
        onPress={() => setShowEndDate(true)}>
        <Text style={styles.dateTimeText}>
          Event End Date: {formatDate(event.end_date)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dateTimeButton}
        onPress={() => setShowEndTime(true)}>
        <Text style={styles.dateTimeText}>
          Event End Time: {formatTime(event.end_time)}
        </Text>
      </TouchableOpacity>

      {(showStartDate || showEndDate) && (
        <DateTimePicker
          value={showStartDate ? event.start_date : event.end_date}
          mode="date"
          onChange={(event, selectedDate) => {
            if (showStartDate) {
              setShowStartDate(false);
              if (selectedDate) {
                setEvent(prev => ({...prev, start_date: selectedDate}));
              }
            } else {
              setShowEndDate(false);
              if (selectedDate) {
                setEvent(prev => ({...prev, end_date: selectedDate}));
              }
            }
          }}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        />
      )}

      {(showStartTime || showEndTime) && (
        <DateTimePicker
          value={showStartTime ? event.start_time : event.end_time}
          mode="time"
          onChange={(event, selectedTime) => {
            if (showStartTime) {
              setShowStartTime(false);
              if (selectedTime) {
                setEvent(prev => ({...prev, start_time: selectedTime}));
              }
            } else {
              setShowEndTime(false);
              if (selectedTime) {
                setEvent(prev => ({...prev, end_time: selectedTime}));
              }
            }
          }}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        />
      )}

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Time Zone</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={event.timezone}
            onValueChange={value =>
              setEvent(prev => ({...prev, timezone: value}))
            }
            style={[
              styles.picker,
              Platform.OS === 'ios' && {backgroundColor: '#1A1A1A'},
            ]}
            dropdownIconColor="#FFFFFF"
            itemStyle={{color: '#FFFFFF'}}>
            <Picker.Item label="Select Time Zone" value="" />
            {TIMEZONES.map(timezone => (
              <Picker.Item key={timezone} label={timezone} value={timezone} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Sell Tickets</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={event.sell_tickets}
            onValueChange={value =>
              setEvent(prev => ({...prev, sell_tickets: value}))
            }
            style={[
              styles.picker,
              Platform.OS === 'ios' && {backgroundColor: '#1A1A1A'},
            ]}
            dropdownIconColor="#FFFFFF"
            itemStyle={{color: '#FFFFFF'}}>
            <Picker.Item label="No" value={false} />
            <Picker.Item label="Yes" value={true} />
          </Picker>
        </View>
      </View>

      {event.sell_tickets && (
        <>
          <TextInput
            mode="outlined"
            label="Total Tickets Available"
            value={event.total_tickets?.toString()}
            onChangeText={text =>
              setEvent(prev => ({...prev, total_tickets: parseInt(text) || 0}))
            }
            keyboardType="numeric"
            style={styles.input}
            theme={{
              colors: {
                primary: '#CA2B28',
                text: '#FFFFFF',
                placeholder: '#FFFFFF',
              },
            }}
            textColor="#FFFFFF"
          />

          <TextInput
            mode="outlined"
            label="Ticket Price (₹)"
            value={event.ticket_price?.toString()}
            onChangeText={text =>
              setEvent(prev => ({...prev, ticket_price: parseInt(text) || 0}))
            }
            keyboardType="numeric"
            style={styles.input}
            theme={{
              colors: {
                primary: '#CA2B28',
                text: '#FFFFFF',
                placeholder: '#FFFFFF',
              },
            }}
            textColor="#FFFFFF"
          />
        </>
      )}

      <TextInput
        mode="outlined"
        label="Event Description"
        value={event.event_description}
        onChangeText={text =>
          setEvent(prev => ({...prev, event_description: text}))
        }
        multiline
        numberOfLines={4}
        style={styles.input}
        theme={{
          colors: {
            primary: '#CA2B28',
            text: '#FFFFFF',
            placeholder: '#FFFFFF',
          },
        }}
        textColor="#FFFFFF"
      />

      <TouchableOpacity style={styles.uploadButton} onPress={pickVideo}>
        <Text style={styles.uploadButtonText}>
          {localVideoUri ? 'Change Event Video' : 'Upload Event Video'}
        </Text>
      </TouchableOpacity>

      {localVideoUri && (
        <View style={styles.videoPreviewContainer}>
          <View style={styles.videoContent}>
            <Icon name="video" size={40} color="#CA2B28" />
            <Text style={styles.videoFileName}>{videoFileName}</Text>
          </View>
          <TouchableOpacity onPress={clearVideo}>
            <Icon name="close-circle" size={24} color="#CA2B28" />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.publishButton, loading && styles.publishButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={styles.loadingText}>
              {uploadLoading ? 'Uploading files...' : 'Publishing event...'}
            </Text>
          </View>
        ) : (
          <Text style={styles.publishButtonText}>Publish Event</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddEventScreen;
