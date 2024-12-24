import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Alert,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';
import {countries} from '../../data/countries/Countries';
import {UserType} from '../../type';
import {userData} from './UserProfileData';
import {useAuth} from '../../asyncStorage/AsyncStorage';
import {profileService, ProfileUpdateData} from '../API/Profile/UserprofileApi';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './CSS/Userprofile';

const DEFAULT_PROFILE_IMAGE = require('../../assests/logo/logo.png');

interface EditableField {
  label: string;
  key: keyof UserType;
  editable: boolean;
  type?: 'text' | 'gender' | 'country' | 'image' | 'multiline' | 'date';
}

const genderOptions = [
  {label: 'Male', value: 'male'},
  {label: 'Female', value: 'female'},
  {label: 'Other', value: 'other'},
];

const UserProfile: React.FC = () => {
  const {logout} = useAuth();
  const [user, setUser] = useState<UserType>(userData);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<keyof UserType | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await profileService.fetchProfile();
      setUser(profileData);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        await logout();
      } else {
        Alert.alert('Error', 'Failed to load profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const editableFields: EditableField[] = [
    {label: 'Name', key: 'full_name', editable: false, type: 'text'},
    {label: 'Email', key: 'email', editable: false, type: 'text'},
    {label: 'Bio', key: 'bio', editable: true, type: 'multiline'},
    {label: 'Phone Number', key: 'phone_number', editable: true, type: 'text'},
    {label: 'Country', key: 'country', editable: true, type: 'country'},
    {label: 'Gender', key: 'gender', editable: true, type: 'gender'},
    {
      label: 'Date of Birth',
      key: 'date_of_birth',
      editable: true,
      type: 'date',
    },
    {
      label: 'Subscription',
      key: 'subscriptionType',
      editable: false,
      type: 'text',
    },
  ];

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 33) {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
              title: 'Photo Access Required',
              message:
                'This app needs access to your photos to set profile picture',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          return result === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Photo Access Required',
              message:
                'This app needs access to your photos to set profile picture',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          return result === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleImagePick = async () => {
    const hasPermission = await requestPermissions();

    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Please enable photo library access in your device settings to change profile picture.',
      );
      return;
    }

    const options: ImagePicker.ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1,
      maxWidth: 1000,
      maxHeight: 1000,
      includeBase64: false,
      selectionLimit: 1,
    };

    try {
      setIsSaving(true);
      const response = await ImagePicker.launchImageLibrary(options);

      if (response.didCancel || response.errorCode) {
        return;
      }

      const imageUrl = response.assets?.[0]?.uri;
      if (imageUrl) {
        await profileService.updateProfile({imageUrl});
        setUser(prev => ({
          ...prev,
          imageUrl,
        }));
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to update profile picture');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (field: keyof UserType) => {
    setEditingField(field);
    if (field === 'date_of_birth') {
      const date = user[field] ? new Date(user[field] as string) : new Date();
      setSelectedDate(date);
      if (Platform.OS === 'android') {
        setShowDatePicker(true);
      } else {
        setIsEditing(true);
      }
    } else {
      setEditValue(user[field]?.toString() || '');
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!editingField) return;

    try {
      setIsSaving(true);
      let valueToSave = editValue;

      if (editingField === 'date_of_birth') {
        valueToSave = selectedDate.toISOString().split('T')[0];
        await handleSaveDate(valueToSave);
        return;
      }

      if (editingField !== 'country' && typeof valueToSave === 'string') {
        valueToSave = valueToSave.trim();
        if (valueToSave === '') {
          Alert.alert('Error', 'Please enter a valid value');
          return;
        }
      }

      if (
        editingField === 'phone_number' &&
        !/^\+?\d{10,}$/.test(valueToSave.replace(/\s/g, ''))
      ) {
        Alert.alert('Error', 'Please enter a valid phone number');
        return;
      }

      const updateData: ProfileUpdateData = {
        [editingField]: valueToSave,
      };

      await profileService.updateProfile(updateData);
      setUser(prev => ({
        ...prev,
        [editingField]: valueToSave,
      }));

      setEditingField(null);
      setShowCountryPicker(false);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to update profile',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCountries = countries.filter(country =>
    country.label.toLowerCase().includes(countrySearch.toLowerCase()),
  );
  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toISOString().split('T')[0];
      setEditValue(formattedDate);

      if (Platform.OS === 'android') {
        handleSaveDate(formattedDate);
      }
    }
  };

  const handleSaveDate = async (dateValue: string) => {
    try {
      setIsSaving(true);
      const updateData: ProfileUpdateData = {
        dateOfBirth: dateValue,
      };

      await profileService.updateProfile(updateData);
      setUser(prev => ({
        ...prev,
        date_of_birth: dateValue,
      }));

      setEditingField(null);
      setIsEditing(false);
      Alert.alert('Success', 'Date of birth updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update date of birth');
    } finally {
      setIsSaving(false);
    }
  };

  const renderCountryPicker = () => (
    <Modal
      visible={showCountryPicker}
      transparent
      animationType="slide"
      onRequestClose={() => setShowCountryPicker(false)}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, styles.countryPickerModal]}>
          <Text style={styles.modalTitle}>Select Country</Text>

          <View style={styles.searchContainer}>
            <Icon
              name="search"
              size={20}
              color="#B3B3B3"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              value={countrySearch}
              onChangeText={setCountrySearch}
              placeholder="Search country..."
              placeholderTextColor="#888"
            />
          </View>

          <FlatList
            data={filteredCountries}
            keyExtractor={item => item.label}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.countryItem}
                onPress={() => {
                  setEditValue(item.label);
                  setShowCountryPicker(false);
                  handleSave();
                }}>
                <Text style={styles.countryItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            style={styles.countryList}
          />

          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => setShowCountryPicker(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderEditModal = () => {
    if (!editingField) return null;

    const field = editableFields.find(f => f.key === editingField);
    if (!field) return null;

    return (
      <Modal
        visible={isEditing}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditing(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {field.label}</Text>

            {field.type === 'date' && Platform.OS === 'ios' ? (
              renderDateField()
            ) : field.type === 'gender' ? (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={editValue}
                  onValueChange={value => setEditValue(value)}
                  style={[styles.picker, {color: '#FFFFFF'}]}>
                  {genderOptions.map(option => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                      color={Platform.OS === 'ios' ? '#FFFFFF' : '#000000'}
                    />
                  ))}
                </Picker>
              </View>
            ) : field.type === 'country' ? (
              <TouchableOpacity
                style={styles.countryPickerButton}
                onPress={() => {
                  setIsEditing(false);
                  setShowCountryPicker(true);
                }}>
                <Text style={styles.countryPickerButtonText}>
                  {editValue || 'Select Country'}
                </Text>
                <Icon name="arrow-drop-down" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TextInput
                style={[
                  styles.input,
                  field.type === 'multiline' && styles.multilineInput,
                ]}
                value={editValue}
                onChangeText={setEditValue}
                multiline={field.type === 'multiline'}
                numberOfLines={field.type === 'multiline' ? 4 : 1}
                autoFocus
                keyboardType={
                  field.key === 'phone_number' ? 'phone-pad' : 'default'
                }
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setIsEditing(false);
                  setShowDatePicker(false);
                }}
                style={[styles.modalButton, styles.cancelButton]}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              {(field.type !== 'date' || Platform.OS === 'ios') && (
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={isSaving}
                  style={[styles.modalButton, styles.saveButton]}>
                  {isSaving ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>Save</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  const renderDateField = () => {
    if (Platform.OS === 'android') {
      return showDatePicker ? (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      ) : null;
    }

    return (
      <DateTimePicker
        value={selectedDate}
        mode="date"
        display="spinner"
        onChange={handleDateChange}
        maximumDate={new Date()}
      />
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerOverlay} />
        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={handleImagePick}
          disabled={isSaving}
          activeOpacity={0.8}>
          <Image
            source={
              user.imageUrl ? {uri: user.imageUrl} : DEFAULT_PROFILE_IMAGE
            }
            style={styles.profileImage}
          />
          {isSaving ? (
            <View style={styles.imageLoadingOverlay}>
              <ActivityIndicator color="#FFFFFF" />
            </View>
          ) : (
            <View style={styles.imageEditBadge}>
              <Icon name="camera-alt" size={16} color="#FFFFFF" />
            </View>
          )}
          {user.subscriptionType === 'premium' && (
            <View style={styles.premiumBadge}>
              <Icon name="star" size={16} color="#FFD700" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.full_name}</Text>
          <Text style={styles.username}>{user.email}</Text>
          <Text style={styles.bio}>{user.bio}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {user.followers.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {user.following.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        {editableFields.map(field => (
          <View key={field.key} style={styles.detailRow}>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>{field.label}</Text>
              <Text style={styles.detailValue}>
                {user[field.key]?.toString() || '-'}
              </Text>
            </View>
            {field.editable && (
              <TouchableOpacity
                onPress={() => handleEdit(field.key)}
                disabled={isSaving}
                style={styles.editButton}
                activeOpacity={0.7}>
                <Icon name="edit" size={20} color="#4A90E2" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {renderEditModal()}
      {renderCountryPicker()}
      {Platform.OS === 'android' && renderDateField()}
    </ScrollView>
  );
};

export default UserProfile;
