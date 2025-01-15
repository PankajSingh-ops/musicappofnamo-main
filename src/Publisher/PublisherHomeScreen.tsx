import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../common/HeaderUser';
import HomeScreen from './HomeScreen';
import FavoritesScreen from '../User/UserFavourites';
import AnalyticsScreen from './AnalyticsScreen';
import PlaylistScreen from '../PlaylistDetails/PlayListScreen';
import AddMusicAndAlbum from './Common/AddMusicAndAlbum';

const Tab = createBottomTabNavigator();

// Custom Tab Icon Component with Circle Background
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
  return (
    <View
      style={[styles.iconContainer, focused && styles.focusedIconContainer]}>
      <Icon name={name} color={focused ? '#FFFFFF' : '#b3b3b3'} size={size} />
    </View>
  );
};

const PublisherHomeScreen = () => {
  return (
    <>
      <Header />
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Favorites':
                iconName = 'heart';
                break;
              case 'Add':
                iconName = 'plus';
                break;
              case 'Playlists':
                iconName = 'list';
                break;
              case 'Analytics':
                iconName = 'bar-chart';
                break;
              default:
                iconName = 'home';
            }

            return (
              <TabBarIcon
                name={iconName}
                focused={focused}
                color={color}
                size={20}
              />
            );
          },
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '#b3b3b3',
          tabBarStyle: styles.tabBar,
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
          name="Add"
          component={AddMusicAndAlbum}
          options={{tabBarLabel: ''}}
        />
        <Tab.Screen
          name="Playlists"
          component={PlaylistScreen}
          options={{tabBarLabel: ''}}
        />
        <Tab.Screen
          name="Analytics"
          component={AnalyticsScreen}
          options={{tabBarLabel: ''}}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  focusedIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabBar: {
    backgroundColor: '#B62D25',
    borderTopColor: 'transparent',
    height: 60,
    paddingBottom: 5,
    elevation: 0,
    shadowOpacity: 0,
  },
});

export default PublisherHomeScreen;
