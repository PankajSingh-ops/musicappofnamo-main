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

export default function RegisterScreen({route, navigation}: any) {
  const {role = 'user'} = route.params || {};
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // In RegisterScreen.tsx
const handleRegister = async () => {
  // Basic client-side validation
  if (!fullName || !email || !password) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }

  setLoading(true);
  try {
    console.log('Sending registration request with:', {
      fullName,
      email,
      password,
      role,
    });

    const response = await axios.post(
      'http://10.0.2.2:3000/api/auth/register',
      {
        fullName,
        email,
        password,
        role,
      },
    );

    // Handle successful registration
    Alert.alert('Success', response.data.message, [
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate('SignIn', {email});
        },
      },
    ]);
  } catch (error: any) {
    console.error('Registration error:', error.response?.data || error.message);
    Alert.alert(
      'Registration Error',
      error.response?.data?.details || error.response?.data?.error || 'An error occurred during registration'
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.heading}>
        Register as {role.charAt(0).toUpperCase() + role.slice(1)}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#aaa"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!passwordVisible}
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={styles.eyeIcon}>
          <Text style={{color: '#fff'}}>{passwordVisible ? '👁️' : '🙈'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Registering...' : 'Register'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

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
  input: {
    backgroundColor: '#333',
    color: 'white',
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
