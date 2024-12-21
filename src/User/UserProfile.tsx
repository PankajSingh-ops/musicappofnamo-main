import React, { useState } from 'react';
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
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { UserType } from '../../type';
import { userData } from './UserProfileData';

interface EditableField {
  label: string;
  key: keyof UserType;
  editable: boolean;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserType>(userData);
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const editableFields: EditableField[] = [
    { label: 'Name', key: 'name', editable: true },
    { label: 'Username', key: 'username', editable: false },
    { label: 'Bio', key: 'bio', editable: true },
    { label: 'Phone Number', key: 'phoneNumber', editable: true },
    { label: 'Country', key: 'country', editable: true },
    { label: 'Gender', key: 'gender', editable: true },
    { label: 'Date of Birth', key: 'dateOfBirth', editable: true },
    { label: 'Subscription', key: 'subscriptionType', editable: false },
  ];

  const handleEdit = (field: keyof UserType) => {
    setEditingField(field);
    setEditValue(user[field] as string);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editingField) {
      setUser(prev => ({
        ...prev,
        [editingField]: editValue
      }));
      setIsEditing(false);
      setEditingField(null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerOverlay} />
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: user.imageUrl }} style={styles.profileImage} />
          {user.subscriptionType === 'premium' && (
            <View style={styles.premiumBadge}>
              <Icon name="star" size={16} color="#FFD700" />
            </View>
          )}
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          <Text style={styles.bio}>{user.bio}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{user.followers.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{user.following.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        {editableFields.map((field) => (
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
              >
                <Icon name="edit" size={20} color="#4A90E2" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      <Modal
        visible={isEditing}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditing(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Edit {editingField?.charAt(0).toUpperCase() + editingField?.slice(1)}
            </Text>
            <TextInput
              style={styles.input}
              value={editValue}
              onChangeText={setEditValue}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setIsEditing(false)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={[styles.modalButton, styles.saveButton]}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  premiumBadge: {
    position: 'absolute',
    bottom: 0,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#282828',
    borderRadius: 12,
    padding: 20,
    width: '80%',
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
});

export default UserProfile;