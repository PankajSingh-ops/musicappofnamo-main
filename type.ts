import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Music: undefined;
  Auth: undefined;
  Register: undefined;
  SignIn: undefined;
  ForgetPassword:undefined;
  VerifyOTP:{ email?: string };
  ResetPassword:{ email?: string };
  Userhome:undefined;
  GenreDetails:undefined;
  Genre:undefined;
  NewReleases:undefined;
  TopMusic:undefined;
  ArtistDetail:undefined;
  ArtistMain:undefined;
  UserProfile:undefined;
};

export type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Splash'
>;

export interface Track {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  duration: string;
  url: string;
}

export interface Genre {
  id: string;
  name: string;
  image: any;
  totalSongs: number;
}

export interface ArtistSong {
  id: string;
  title: string;
  duration: string;
  plays: number;
  albumName?: string;
  albumCover?: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  coverImageUrl: string;
  monthlyListeners: number;
  genres: string[];
  songs: ArtistSong[];
  bio: string;
}

export interface UserType {
  id: string;
  name: string;
  username: string;
  imageUrl: string;
  followers: number;
  following: number;
  bio: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  country: string;
  subscriptionType: 'free' | 'premium';
}