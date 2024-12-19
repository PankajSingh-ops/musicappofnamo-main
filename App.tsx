import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './src/common/SplashScreen';
import MusicPlayer from './src/screen/MusicPlayer'; // Renamed from previous App component
import {RootStackParamList} from './type';
import HomeScreen from './src/Home/HomeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Music" component={MusicPlayer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
