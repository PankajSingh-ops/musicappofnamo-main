import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';
import {countries} from '../../data/countries/Countries';
import {UserType} from '../../type';
import {userData} from './UserProfileData';

interface EditableField {
  label: string;
  key: keyof UserType;
  editable: boolean;
  type?: 'text' | 'gender' | 'country' | 'image' | 'multiline';
}

const genderOptions = [
  {label: 'Male', value: 'male'},
  {label: 'Female', value: 'female'},
  {label: 'Other', value: 'other'},
];

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserType>(userData);
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<keyof UserType | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const editableFields: EditableField[] = [
    {label: 'Name', key: 'name', editable: true, type: 'text'},
    {label: 'Username', key: 'username', editable: false, type: 'text'},
    {label: 'Bio', key: 'bio', editable: true, type: 'multiline'},
    {label: 'Phone Number', key: 'phoneNumber', editable: true, type: 'text'},
    {label: 'Country', key: 'country', editable: true, type: 'country'},
    {label: 'Gender', key: 'gender', editable: true, type: 'gender'},
    {label: 'Date of Birth', key: 'dateOfBirth', editable: true, type: 'text'},
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
      const response = await ImagePicker.launchImageLibrary(options);

      if (response.didCancel || response.errorCode) {
        return;
      }

      // Ensure we update with either the new URI or null
      setUser(prev => ({
        ...prev,
        imageUrl: response.assets?.[0]?.uri ?? null,
      }));
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleEdit = (field: keyof UserType) => {
    setEditingField(field);
    setEditValue(user[field] as string);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editingField) return;

    // Basic validation
    if (editValue.trim() === '') {
      Alert.alert('Error', 'Please enter a valid value');
      return;
    }

    // Phone number validation
    if (
      editingField === 'phoneNumber' &&
      !/^\+?\d{10,}$/.test(editValue.replace(/\s/g, ''))
    ) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setUser(prev => ({
      ...prev,
      [editingField]: editValue,
    }));
    setIsEditing(false);
    setEditingField(null);
    setShowCountryPicker(false);
  };
  const filteredCountries = countries.filter(country =>
    country.label.toLowerCase().includes(countrySearch.toLowerCase()),
  );

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

            {field.type === 'gender' ? (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={editValue}
                  onValueChange={value => setEditValue(value)}
                  style={styles.picker}>
                  {genderOptions.map(option => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                      color="#FFFFFF"
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
                  field.key === 'phoneNumber' ? 'phone-pad' : 'default'
                }
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setIsEditing(false)}
                style={[styles.modalButton, styles.cancelButton]}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={[styles.modalButton, styles.saveButton]}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerOverlay} />
        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={handleImagePick}
          activeOpacity={0.8}>
          <Image source={{uri: user.imageUrl}} style={styles.profileImage} />
          <View style={styles.imageEditBadge}>
            <Icon name="camera-alt" size={16} color="#FFFFFF" />
          </View>
          {user.subscriptionType === 'premium' && (
            <View style={styles.premiumBadge}>
              <Icon name="star" size={16} color="#FFD700" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.username}>@{user.username}</Text>
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
                {user[field.key]?.toString()}
              </Text>
            </View>
            {field.editable && (
              <TouchableOpacity
                onPress={() => handleEdit(field.key)}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#282828',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: '#404040',
  },
  profileImageContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#121212',
  },
  imageEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  premiumBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#282828',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#B3B3B3',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#B3B3B3',
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#B3B3B3',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#404040',
  },
  detailsContainer: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  editButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#282828',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#404040',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: '#404040',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  pickerContainer: {
    backgroundColor: '#404040',
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    color: '#FFFFFF',
  },
  countryPickerModal: {
    height: '70%',
    maxHeight: 600,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#404040',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    padding: 12,
    fontSize: 16,
  },
  countryList: {
    marginBottom: 16,
  },
  countryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  countryItemText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  countryPickerButton: {
    backgroundColor: '#404040',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countryPickerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default UserProfile;
