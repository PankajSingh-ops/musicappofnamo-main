import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../../asyncStorage/AsyncStorage'; // Import the auth context

const SignInScreen= ({route, navigation}:any) => {
  // Extract email from registration if passed
  const {email: initialEmail} = route.params || {};

  // Use the auth context
  const { login } = useAuth();

  // State management
  const [email, setEmail] = useState(initialEmail || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Determine the correct localhost URL based on platform
  const getLocalhostURL = (): string => {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000/api/auth/login';
    }
    // For iOS and other platforms
    return 'http://localhost:3000/api/auth/login';
  };

  // Handle Sign In
  const handleSignIn = async () => {
    // Basic validation
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const backendURL = getLocalhostURL();

      console.log('Attempting login with:', {email, password});

      const response = await axios.post(
        backendURL,
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 seconds timeout
        },
      );

      console.log('Login response:', response.data);
      const { user, token } = response.data;
      await login(user, token);
      Alert.alert('Success', 'Login Successful', [
        {
          text: 'OK',
          onPress: () => {
            const userRole = user.role;
            switch (userRole) {
              case 'publisher':
                navigation.navigate('PublisherHomeScreen');
                break;
              case 'user':
                navigation.navigate('Userhome');
                break;
              default:
                navigation.navigate('Home');
            }
          },
        },
      ]);
    } catch (error: any) {
      console.error('Login Error:', error);

      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);

        Alert.alert(
          'Login Error',
          error.response.data.error ||
            error.response.data.message ||
            'Login failed',
        );
      } else if (error.request) {
        console.error('No response received', error.request);
        Alert.alert(
          'Network Error',
          'No response from server. Please check your connection.',
        );
      } else {
        console.error('Error setting up request:', error.message);
        Alert.alert('Error', 'Unable to send login request');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSupport = () => {
    navigation.navigate('SupportForm')
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.heading}>Sign In</Text>
        <Text style={styles.subHeading}>For any support <Text style={styles.linkHeading} onPress={handleSupport}>click here</Text> </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!passwordVisible}
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={styles.eyeIcon}>
          <Text style={{color: '#fff'}}>{passwordVisible ? '👁️' : '🙈'}</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text onPress={()=>navigation.navigate('ForgetPassword')} style={styles.forgetpassword}>Forget Password?</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignIn}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Signing In...' : 'Sign In'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  forgetpassword:{
color:'red',
padding:2,
  },
  linkHeading:{
fontSize:18,
color:'rgba(182, 45, 37, 1)',
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  button: {
    backgroundColor: 'rgba(182, 45, 37, 1)',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SignInScreen;
