import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const UserDetails = () => {
  // Placeholder user data (in a real app, this would come from state/context)
  const userData = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, USA',
    age: 28,
    occupation: 'Software Developer',
    memberSince: 'January 2022',
  };

  const UserInfoRow = ({icon, label, value}:any) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIconContainer}>
        <Icon name={icon} size={24} color="#4A90E2" />
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{uri: 'https://via.placeholder.com/150'}}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editProfileButton}>
            <Icon name="pencil" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.nameText}>{userData.name}</Text>
        <Text style={styles.taglineText}>Software Developer</Text>
      </View>

      {/* User Information Section */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <UserInfoRow
          icon="mail-outline"
          label="Email Address"
          value={userData.email}
        />
        <UserInfoRow
          icon="call-outline"
          label="Phone Number"
          value={userData.phone}
        />
        <UserInfoRow
          icon="location-outline"
          label="Address"
          value={userData.address}
        />
        <UserInfoRow
          icon="calendar-outline"
          label="Age"
          value={userData.age.toString()}
        />
        <UserInfoRow
          icon="briefcase-outline"
          label="Occupation"
          value={userData.occupation}
        />
        <UserInfoRow
          icon="time-outline"
          label="Member Since"
          value={userData.memberSince}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="settings-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Account Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="lock-closed-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Privacy</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: 'white',
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
    padding: 8,
  },
  nameText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  taglineText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
  infoSection: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIconContainer: {
    backgroundColor: '#E6F2FF',
    padding: 10,
    borderRadius: 10,
    marginRight: 15,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    color: '#666',
    fontSize: 14,
    marginBottom: 5,
  },
  infoValue: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
  },
  actionButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    flex: 0.48,
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: '600',
  },
});

export default UserDetails;
