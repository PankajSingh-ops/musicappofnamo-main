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
};

export type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Splash'
>;

export interface Track {
  id: string;
  title: string;
  artist: string;
  image: string;
  duration: string;
  url: string;
}