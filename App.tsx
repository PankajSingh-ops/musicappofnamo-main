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
import {AddAlbum, NewMusic, TopMusic} from './src/User/Settings/NewAndTopMusic';
import UserProfile from './src/User/UserProfile';
import { MusicProvider } from './src/Music Player/MusicContext';
import PublisherAuthScreen from './src/auth/PublisherAuthPage';
import PublisherRegisterScreen from './src/auth/PublisherRegisterScreen';
import PublisherHomeScreen from './src/Publisher/PublisherHomeScreen';
import PlaylistDetails from './src/PlaylistDetails/PlaylistDetails';
import AddMusicAndAlbum from './src/Publisher/Common/AddMusicAndAlbum';
import AddMusic from './src/Publisher/AddMusic';
import AlbumList from './src/Album/AlbumList';
import AlbumDetail from './src/Album/AlbumDetails';
import ArtistMainPage from './src/Artist/ArtistMainPage';
import ArtistDetailPage from './src/Artist/ArtistDetailsPage';
import AddEventScreen from './src/Events/AddEventsScreen/AddEventsScree';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <AuthProvider>
         <MusicProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{headerShown:false}}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Music" component={MusicPlayer} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="PublisherAuth" component={PublisherAuthScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="PublisherRegister" component={PublisherRegisterScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen
            name="ForgetPassword"
            component={ForgetPasswordScreen}
          />
          <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="Userhome" component={UserHomeScreen} />
          <Stack.Screen name="PublisherHomeScreen" component={PublisherHomeScreen} />
          <Stack.Screen name="Genre" component={Genre} />
          <Stack.Screen name="GenreDetails" component={GenreDetails} />
          <Stack.Screen name="NewReleases" component={NewMusic} />
          <Stack.Screen name="TopMusic" component={TopMusic} />
          <Stack.Screen name="ArtistMain" component={ArtistMainPage} />
          <Stack.Screen name="ArtistDetail" component={ArtistDetailPage} />
          <Stack.Screen name="UserProfile" component={UserProfile} />
          <Stack.Screen name="PlaylistDetails" component={PlaylistDetails} />
          <Stack.Screen name="AddAlbums" component={AddAlbum} />
          <Stack.Screen name="AddMusicAndAlbum" component={AddMusicAndAlbum} />
          <Stack.Screen name="AddMusic" component={AddMusic} />
          <Stack.Screen name="Albums" component={AlbumList} />
          <Stack.Screen name="AlbumDetail" component={AlbumDetail} />
          <Stack.Screen name="AddEventsScreen" component={AddEventScreen} />







        </Stack.Navigator>
      </NavigationContainer>
      </MusicProvider>
    </AuthProvider>
  );
};

export default App;
