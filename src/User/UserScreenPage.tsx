import React from 'react';
import {View, StyleSheet, FlatList, Text, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../common/HeaderUser';
import userContent from './userContent.json';
import FavoritesScreen from './UserFavourites';
import PublisherPlaylist from '../Publisher/PublisherPlaylist';
import PlaylistScreen from '../PlaylistDetails/PlayListScreen';

// Recently Played Component
const RecentlyPlayedList = () => (
  <FlatList
    horizontal
    data={userContent.recentlyPlayed}
    keyExtractor={item => item.id.toString()}
    renderItem={({item}) => (
      <View style={styles.card}>
        <Image source={{uri: item.image}} style={styles.cardImage} />
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
    )}
  />
);

// Home Screen Component
const HomeScreen = () => (
  <View style={styles.container}>
    <FlatList
      ListHeaderComponent={
        <>
          <Text style={styles.sectionTitle}>Recently Played</Text>
          <RecentlyPlayedList />
          <Text style={styles.sectionTitle}>Try Something Else</Text>
        </>
      }
      data={userContent.suggestions}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => (
        <View style={styles.suggestionCard}>
          <Image source={{uri: item.image}} style={styles.cardImage} />
          <View style={styles.suggestionText}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </View>
        </View>
      )}
    />
  </View>
);

// Tab Navigator
const Tab = createBottomTabNavigator();

// Icon Component
const TabBarIcon = ({
  name,
  focused,
  color,
  size,
}: {
  name: string;
  focused: boolean;
  color: string;
  size: number;
}) => {
  // Adjust icon based on focus state
  return (
    <Icon
      name={name} // Uses FontAwesome icon names
      color={color}
      size={size}
      style={{opacity: focused ? 1 : 0.8}}
    />
  );
};

// User Home Screen with Tab Navigation
const UserHomeScreen = () => {
  return (
    <>
      <Header />
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => (
            <TabBarIcon
              name={
                route.name === 'Home'
                  ? 'home'
                  : route.name === 'Favorites'
                  ? 'heart'
                  : 'list' // Changed from 'cog' to 'list' for playlists
              }
              focused={focused}
              color={color}
              size={size}
            />
          ),
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '#b3b3b3',
          tabBarStyle: {
            backgroundColor: '#B62D25',
            borderTopColor: 'transparent',
          },
          headerShown: false,
        })}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{tabBarLabel: ''}}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{tabBarLabel: ''}}
        />
        <Tab.Screen
          name="Playlists"
          component={PlaylistScreen}
          options={{
            tabBarLabel: '',
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  sectionTitle: {
    fontSize: 24,
    color: 'red',
    margin: 15,
  },
  card: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  cardTitle: {
    color: 'white',
    marginTop: 5,
  },
  suggestionCard: {
    flexDirection: 'row',
    margin: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 10,
  },
  suggestionText: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  cardDescription: {
    color: '#aaa',
  },
});

export default UserHomeScreen;
