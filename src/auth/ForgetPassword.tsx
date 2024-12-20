import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../type'; // Adjust import as needed

// Explicitly type the props
type ForgetPasswordScreenProps = NativeStackScreenProps<RootStackParamList, 'ForgetPassword'>;

const ForgetPasswordScreen: React.FC<ForgetPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const getLocalhostURL = (): string => {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000/api/auth/forget-password';
    }
    return 'http://localhost:3000/api/auth/forget-password';
  };

  const handleSendOTP = async () => {
    // Basic email validation
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const backendURL = getLocalhostURL();

      const response = await axios.post(
        backendURL,
        { email },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        }
      );
       console.log(response);
       
      navigation.navigate('VerifyOTP', { email });
    } catch (error: any) {
      console.error('Forget Password Error:', error);

      if (error.response) {
        Alert.alert(
          'Error',
          error.response.data.error || error.response.data.message || 'Failed to send OTP'
        );
      } else if (error.request) {
        Alert.alert(
          'Network Error',
          'No response from server. Please check your connection.'
        );
      } else {
        Alert.alert('Error', 'Unable to send OTP request');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.heading}>Forget Password</Text>
      <Text style={styles.subHeading}>
        Enter your email to receive a password reset OTP
      </Text>

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

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSendOTP}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
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
  input: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
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

export default ForgetPasswordScreen;