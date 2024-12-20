import React, {useState} from 'react';
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
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../type'; // Adjust import as needed

type VerifyOTPScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'VerifyOTP'
>;

const VerifyOTPScreen: React.FC<VerifyOTPScreenProps> = ({
  route,
  navigation,
}) => {
  const {email} = route.params;
  const [otp, setOTP] = useState('');
  const [loading, setLoading] = useState(false);

  const getLocalhostURL = (): string => {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000/api/auth/verify-otp';
    }
    return 'http://localhost:3000/api/auth/verify-otp';
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const backendURL = getLocalhostURL();

      const response = await axios.post(
        backendURL,
        {email, otp},
        {
          headers: {'Content-Type': 'application/json'},
          timeout: 10000,
        },
      );
      console.log(response);

      navigation.navigate('ResetPassword', {email});
    } catch (error: any) {
      console.error('OTP Verification Error:', error);

      if (error.response) {
        Alert.alert(
          'Error',
          error.response.data.error ||
            error.response.data.message ||
            'OTP verification failed',
        );
      } else if (error.request) {
        Alert.alert(
          'Network Error',
          'No response from server. Please check your connection.',
        );
      } else {
        Alert.alert('Error', 'Unable to verify OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.heading}>Verify OTP</Text>
      <Text style={styles.subHeading}>
        Enter the 6-digit OTP sent to {email}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit OTP"
        keyboardType="numeric"
        placeholderTextColor="#aaa"
        value={otp}
        onChangeText={setOTP}
        maxLength={6}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleVerifyOTP}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Verifying...' : 'Verify OTP'}
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
    textAlign: 'center',
    letterSpacing: 10,
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

export default VerifyOTPScreen;
