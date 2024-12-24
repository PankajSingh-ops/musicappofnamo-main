import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './src/common/SplashScreen';
import MusicPlayer from './src/screen/MusicPlayer';
import {RootStackParamList} from './type';
import HomeScreen from './src/Home/HomeScreen';
import AuthScreen from './src/auth/AuthMainPage';
import {AuthProvider} from './asyncStorage/AsyncStorage';
import RegisterScreen from './src/auth/RegisterScreen';
import SignInScreen from './src/auth/SignInScreen';
import ForgetPasswordScreen from './src/auth/ForgetPassword';
import VerifyOTPScreen from './src/auth/VerifyOTP';
import ResetPasswordScreen from './src/auth/ResetPassword';
import UserHomeScreen from './src/User/UserScreenPage';
import Genre from './src/User/Settings/Genre';
import GenreDetails from './src/User/Settings/GenreDetails';
import {NewMusic, TopMusic} from './src/User/Settings/NewAndTopMusic';
import {ArtistDetailPage, ArtistMainPage} from './src/Artist/ArtistMainPage';
import UserProfile from './src/User/UserProfile';
import { MusicProvider } from './src/Music Player/MusicContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <AuthProvider>
         <MusicProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{headerShown: true}}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Music" component={MusicPlayer} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen
            name="ForgetPassword"
            component={ForgetPasswordScreen}
          />
          <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="Userhome" component={UserHomeScreen} />
          <Stack.Screen name="Genre" component={Genre} />
          <Stack.Screen name="GenreDetails" component={GenreDetails} />
          <Stack.Screen name="NewReleases" component={NewMusic} />
          <Stack.Screen name="TopMusic" component={TopMusic} />
          <Stack.Screen name="ArtistMain" component={ArtistMainPage} />
          <Stack.Screen name="ArtistDetail" component={ArtistDetailPage} />
          <Stack.Screen name="UserProfile" component={UserProfile} />
        </Stack.Navigator>
      </NavigationContainer>
      </MusicProvider>
    </AuthProvider>
  );
};

export default App;
