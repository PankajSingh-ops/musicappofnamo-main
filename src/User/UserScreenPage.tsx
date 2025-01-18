import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../common/HeaderUser';
import FavoritesScreen from './UserFavourites';
import PlaylistScreen from '../PlaylistDetails/PlayListScreen';
import UserHome from './UserHomeScreen';
import Eventsmain from './Eventsmain';



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
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => (
      <TabBarIcon
        name={
          route.name === 'Home'
            ? 'home'
            : route.name === 'Favorites'
            ? 'heart'
            : route.name === 'Playlists'
            ? 'list'
            : 'calendar' // Icon for "Events"
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
  })}
>
  <Tab.Screen
    name="Home"
    component={UserHome}
    options={{ tabBarLabel: '' }}
  />
  <Tab.Screen
    name="Favorites"
    component={FavoritesScreen}
    options={{ tabBarLabel: '' }}
  />
  <Tab.Screen
    name="Playlists"
    component={PlaylistScreen}
    options={{ tabBarLabel: '' }}
  />
  <Tab.Screen
    name="Events"
    component={Eventsmain} // Reference your Events main page component
    options={{
      tabBarLabel: '',
    }}
  />
</Tab.Navigator>

    </>
  );
};

export default UserHomeScreen;
