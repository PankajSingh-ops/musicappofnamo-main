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
  ScrollView,
} from 'react-native';
import axios from 'axios';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../type'; // Adjust import as needed

type ResetPasswordScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ResetPassword'
>;

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  route,
  navigation,
}) => {
  const {email}:any = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const getLocalhostURL = (): string => {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000/api/auth/reset-password';
    }
    return 'http://localhost:3000/api/auth/reset-password';
  };

  const validatePassword = (password: string): boolean => {
    // Password validation rules
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      Alert.alert(
        'Invalid Password',
        `Password must be at least ${minLength} characters long`,
      );
      return false;
    }

    if (!hasUpperCase) {
      Alert.alert(
        'Invalid Password',
        'Password must contain at least one uppercase letter',
      );
      return false;
    }

    if (!hasLowerCase) {
      Alert.alert(
        'Invalid Password',
        'Password must contain at least one lowercase letter',
      );
      return false;
    }

    if (!hasNumbers) {
      Alert.alert(
        'Invalid Password',
        'Password must contain at least one number',
      );
      return false;
    }

    if (!hasSpecialChar) {
      Alert.alert(
        'Invalid Password',
        'Password must contain at least one special character',
      );
      return false;
    }

    return true;
  };

  const handleResetPassword = async () => {
    // Validation
    if (!newPassword || !confirmPassword) {
      Alert.alert(
        'Error',
        'Please enter both new password and confirm password',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Comprehensive password validation
    if (!validatePassword(newPassword)) {
      return;
    }

    setLoading(true);
    try {
      const backendURL = getLocalhostURL();

      const response = await axios.post(
        backendURL,
        {
          email,
          newPassword,
        },
        {
          headers: {'Content-Type': 'application/json'},
          timeout: 10000,
        },
      );
      console.log(response);

      Alert.alert('Success', 'Password reset successfully', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('SignIn'),
        },
      ]);
    } catch (error: any) {
      console.error('Password Reset Error:', error);

      if (error.response) {
        Alert.alert(
          'Error',
          error.response.data.error ||
            error.response.data.message ||
            'Password reset failed',
        );
      } else if (error.request) {
        Alert.alert(
          'Network Error',
          'No response from server. Please check your connection.',
        );
      } else {
        Alert.alert('Error', 'Unable to reset password');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (
    field: 'newPassword' | 'confirmPassword',
  ) => {
    setPasswordVisible(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Reset Password</Text>
        <Text style={styles.subHeading}>
          Create a new password for your account
        </Text>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry={!passwordVisible.newPassword}
            placeholderTextColor="#aaa"
            value={newPassword}
            onChangeText={setNewPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => togglePasswordVisibility('newPassword')}
            style={styles.eyeIcon}>
            <Text style={{color: '#fff'}}>
              {passwordVisible.newPassword ? '👁️' : '🙈'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            secureTextEntry={!passwordVisible.confirmPassword}
            placeholderTextColor="#aaa"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => togglePasswordVisibility('confirmPassword')}
            style={styles.eyeIcon}>
            <Text style={{color: '#fff'}}>
              {passwordVisible.confirmPassword ? '👁️' : '🙈'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Password Strength Guidelines */}
        <View style={styles.guidelinesContainer}>
          <Text style={styles.guidelinesTitle}>Password must:</Text>
          <Text style={styles.guidelineText}>
            • Be at least 8 characters long
          </Text>
          <Text style={styles.guidelineText}>
            • Contain uppercase and lowercase letters
          </Text>
          <Text style={styles.guidelineText}>
            • Include at least one number
          </Text>
          <Text style={styles.guidelineText}>• Have a special character</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
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
    paddingRight: 50, // Space for eye icon
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
  guidelinesContainer: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 15,
    marginTop: 15,
  },
  guidelinesTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  guidelineText: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 5,
  },
});

export default ResetPasswordScreen;
