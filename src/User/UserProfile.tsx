// src/screens/ProfileScreen.tsx
import React from 'react';
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
import { Picker } from '@react-native-picker/picker';
import { countries } from '../../data/countries/Countries';
import DatePicker from '@react-native-community/datetimepicker';
import styles from './CSS/Userprofile';
import useProfileStore from '../../store/userProfileStore';
import { useAuth } from '../../asyncStorage/AsyncStorage';

const ProfileScreen = () => {
  const { token } = useAuth();
  const {
    profile,
    isLoading,
    isEditing,
    showDatePicker,
    setIsEditing,
    setShowDatePicker,
    updateField,
    fetchProfile,
    updateProfile,
    uploadProfileImage,
  } = useProfileStore();

  React.useEffect(() => {
    if (token) {
      fetchProfile(token);
    }
  }, [token]);

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      updateField('date_of_birth', formattedDate);
    }
  };

  const handleImagePicker = () => {
    const options: ImagePicker.ImageLibraryOptions = {
      mediaType: 'photo',
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 0.8,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel || response.errorCode || !response.assets?.[0]) {
        return;
      }

      const selectedImage = response.assets[0];
      if (!selectedImage.uri || !token) return;

      uploadProfileImage(token, {
        uri: selectedImage.uri,
        type: selectedImage.type,
        fileName: selectedImage.fileName,
      });
    });
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
          value={profile.date_of_birth ? new Date(profile.date_of_birth) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
    </>
  );

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
                source={{ uri: profile.image_url }}
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
              onChangeText={(text) => updateField('bio', text)}
              multiline
              numberOfLines={3}
              placeholder="Write something about yourself"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={profile.phone_number}
              onChangeText={(text) => updateField('phone_number', text)}
              placeholder="Enter phone number"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Country</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={profile.country}
                onValueChange={(value) => updateField('country', value)}
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
                onValueChange={(value) => updateField('gender', value)}
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
              onPress={() => token && updateProfile(token)}
              disabled={isLoading}>
              {isLoading ? (
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