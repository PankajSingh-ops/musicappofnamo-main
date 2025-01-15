import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';
import {countries} from '../../data/countries/Countries';
import {useAuth} from '../../asyncStorage/AsyncStorage';
import DatePicker from '@react-native-community/datetimepicker';
import styles from './CSS/Userprofile';

const ProfileScreen = () => {
  const {token} = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    bio: '',
    phone_number: '',
    country: '',
    gender: '',
    date_of_birth: '',
    image_url: '',
    followers: 0,
    following: 0,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setProfile(prev => ({...prev, date_of_birth: formattedDate}));
    }
  };
  const renderDateOfBirthField = () => (
    <>
      <Text style={styles.label}>Date of Birth</Text>
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowDatePicker(true)}>
        <Text style={styles.datePickerButtonText}>
          {profile.date_of_birth || 'Select Date of Birth'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DatePicker
          value={
            profile.date_of_birth
              ? new Date(profile.date_of_birth)
              : new Date()
          }
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
    </>
  );


  const fetchProfile = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3000/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 0.8,
    };

    ImagePicker.launchImageLibrary(options, async response => {
      if (response.didCancel || response.errorCode || !response.assets) {
        return;
      }

      const selectedImage = response.assets[0];
      if (!selectedImage.uri) return;

      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', {
          uri: selectedImage.uri,
          type: selectedImage.type,
          name: selectedImage.fileName || 'image.jpg',
        });

        const uploadResponse = await fetch(
          'http://10.0.2.2:3000/api/user/profile/upload/image',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          },
        );

        const data = await uploadResponse.json();
        setProfile(prev => ({...prev, imageUrl: data.url}));
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setLoading(false);
      }
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:3000/api/user/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      await response.json();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <TouchableOpacity
            onPress={handleImagePicker}
            style={styles.imageWrapper}>
            {profile.image_url ? (
              <Image
                source={{uri: profile.image_url}}
                style={styles.profileImage}
              />
            ) : (
              <Icon name="person" size={60} color="#666" />
            )}
            <View style={styles.cameraIconContainer}>
              <Icon name="camera-alt" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{profile.full_name}</Text>
        <Text style={styles.email}>{profile.email}</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{profile.followers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{profile.following}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {/* Profile Info Section */}
      <View style={styles.infoContainer}>
        <View style={styles.infoHeader}>
          <Text style={styles.infoTitle}>Profile Information</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.editButton}>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>
        </View>

        {isEditing ? (
          <View style={styles.form}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={styles.bioInput}
              value={profile.bio}
              onChangeText={text => setProfile({...profile, bio: text})}
              multiline
              numberOfLines={3}
              placeholder="Write something about yourself"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={profile.phone_number}
              onChangeText={text => setProfile({...profile, phone_number: text})}
              placeholder="Enter phone number"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Country</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={profile.country}
                onValueChange={value =>
                  setProfile({...profile, country: value})
                }
                style={styles.picker}>
                <Picker.Item label="Select Country" value="" />
                {countries.map((country, index) => (
                  <Picker.Item
                    key={index}
                    label={country.label}
                    value={country.label}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Gender</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={profile.gender}
                onValueChange={value => setProfile({...profile, gender: value})}
                style={styles.picker}>
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>

            {renderDateOfBirthField()}


            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSubmit}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.infoContent}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Bio</Text>
              <Text style={styles.infoText}>{profile.bio || 'No bio yet'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="phone" size={20} color="#ff0000" />
              <Text style={styles.infoText}>
                {profile.phone_number || 'No phone number'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="place" size={20} color="#ff0000" />
              <Text style={styles.infoText}>
                {profile.country || 'No country set'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="person" size={20} color="#ff0000" />
              <Text style={styles.infoText}>
                {profile.gender || 'Not specified'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="cake" size={20} color="#ff0000" />
              <Text style={styles.infoText}>
                {profile.date_of_birth || 'Year not set'}
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};



export default ProfileScreen;
