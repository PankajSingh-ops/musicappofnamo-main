import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Music: undefined;
  Auth: undefined;
  Register: undefined;
  SignIn: undefined;
  ForgetPassword: undefined;
  VerifyOTP: {email?: string};
  ResetPassword: {email?: string};
  Userhome: undefined;
  GenreDetails: undefined;
  Genre: undefined;
  NewReleases: undefined;
  TopMusic: undefined;
  ArtistDetail: undefined;
  ArtistMain: undefined;
  UserProfile: undefined;
  PublisherAuth: undefined;
  PublisherRegister: undefined;
  PublisherHomeScreen: undefined;
  PlaylistDetails: {playlist: Playlist};
  AddAlbums: undefined;
  AddMusicAndAlbum: undefined;
  AddMusic: undefined;
  Albums: undefined;
  AlbumDetail: {album: Album};
  Search:undefined;
  AddEventsScreen:undefined;
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
  full_name: string;
  email: string;
  username: string;
  followers: number;
  following: number;
  bio: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  phone_number: string;
  country: string;
  subscriptionType: 'free' | 'premium';
  imageUrl: string | null; // Add this property
}

export interface Playlist {
  id: string;
  name: string;
  imageUrl: string;
  totalSongs: number;
  creator: string;
}

export interface ActionSheetOption {
  icon: string;
  label: string;
  onPress: () => void;
  type?: 'danger';
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  cover_image: string;
  genre: string;
  release_date: string;
  songs: Track[];
}

export interface Profile {
  full_name: string;
  email: string;
  bio: string;
  phone_number: string;
  country: string;
  gender: string;
  date_of_birth: string;
  image_url: string;
  followers: number;
  following: number;
}

export interface ImageAsset {
  uri: string;
  type?: string;
  fileName?: string;
}

export interface Event {
  event_title: string;
  event_cover: string;
  event_location: 'online' | 'physical';
  location_url: string;
  start_date: Date;
  start_time: Date;
  end_date: Date;
  end_time: Date;
  timezone: string;
  sell_tickets: boolean;
  total_tickets?: number;
  ticket_price?: number;
  event_description: string;
  event_video: string;
}
