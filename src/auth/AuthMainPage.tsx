import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import logo from '../../assests/logo/logo.png';

export default function AuthScreen({navigation}: any) {
  return (
    <View style={styles.container}>
      <Image
        source={logo} // Replace with your logo path
        style={styles.logo}
      />
      <Text style={styles.title}>LET THE MUSIC</Text>
      <Text style={styles.description}>
        If you simply want your song on all Global Platforms and earn revenue,
        this option is for you. You don’t have to pay any annual or monthly fee.
      </Text>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  registerButton: {
    backgroundColor: 'rgba(182, 45, 37, 1)',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    textAlign: 'center',
  },
  signInButton: {
    backgroundColor: 'rgba(182, 45, 37, 1)',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 8,
    width: '100%',
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
