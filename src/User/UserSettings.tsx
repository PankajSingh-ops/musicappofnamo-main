import { useNavigation } from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Switch} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    offlineMode: false,
    streamQuality: 'High',
  });
  const navigation=useNavigation()

  const SettingToggle = ({title, subtitle, value, onToggle}:any) => (
    <View style={styles.settingItem}>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onToggle}
        value={value}
      />
    </View>
  );

  return (
    <View style={styles.screenContainer}>
       <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="chevron-left" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Settings</Text>
              <TouchableOpacity>
                <Icon name="search" size={24} color="white" />
              </TouchableOpacity>
            </View>

      <View style={styles.settingsSection}>
        <SettingToggle
          title="Dark Mode"
          subtitle="Switch between light and dark themes"
          value={settings.darkMode}
          onToggle={() =>
            setSettings(prev => ({...prev, darkMode: !prev.darkMode}))
          }
        />
        <SettingToggle
          title="Notifications"
          subtitle="Receive updates and recommendations"
          value={settings.notifications}
          onToggle={() =>
            setSettings(prev => ({...prev, notifications: !prev.notifications}))
          }
        />
        <SettingToggle
          title="Offline Mode"
          subtitle="Download and play music without internet"
          value={settings.offlineMode}
          onToggle={() =>
            setSettings(prev => ({...prev, offlineMode: !prev.offlineMode}))
          }
        />
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionHeader}>Audio Quality</Text>
        {['Low', 'Medium', 'High'].map(quality => (
          <TouchableOpacity
            key={quality}
            style={[
              styles.qualityOption,
              settings.streamQuality === quality && styles.selectedQuality,
            ]}
            onPress={() =>
              setSettings(prev => ({...prev, streamQuality: quality}))
            }>
            <Text style={styles.qualityOptionText}>{quality}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  screenTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#000',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Favorites Screen Styles
  favoriteTrackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282828',
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
  },
  favoriteTrackImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  favoriteTrackDetails: {
    flex: 1,
  },
  favoriteTrackTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteTrackArtist: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  favoriteTrackDuration: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  removeButton: {
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#888',
    marginTop: 20,
    fontSize: 18,
  },
  // Settings Screen Styles
  settingsSection: {
    backgroundColor: '#282828',
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingSubtitle: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  sectionHeader: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  qualityOption: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#383838',
    borderRadius: 8,
  },
  selectedQuality: {
    backgroundColor: '#1DB954', // Spotify green
  },
  qualityOptionText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export {SettingsScreen};
