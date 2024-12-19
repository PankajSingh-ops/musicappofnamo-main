import React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import imageLogo from '../../assests/logo/logo.png';

const HomeScreen = ({navigation}:any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Image source={imageLogo} style={styles.logoImage} />
        </View>
        <Text style={styles.heading}>Namo Music</Text>
      </View>
      <View style={styles.gap}></View>
      <Text style={styles.subheading}>Enjoy Listening to Music</Text>
      <Text style={styles.description}>
        For Advanced Artists who want their song on all global platforms along
        with CallerTunes on Indian Mobile Network and earn revenue
      </Text>
      <View style={styles.buttonContainer}>
      <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={() => navigation.navigate('Music')}>
          <Text style={styles.button}>Music</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={() => navigation.navigate('auth', { role: 'publisher' })}>
          <Text style={styles.button}>Publisher</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={() => navigation.navigate('auth', { role: 'user' })}>
          <Text style={styles.button}>User</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  gap: {
    height: '40%',
  },
  logo: {
    width: 60,
    height: 60,
    backgroundColor: 'transparent',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  heading: {
    color: '#f00',
    fontSize: 36,
    fontWeight: 'bold',
  },
  subheading: {
    color: '#fff',
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  description: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    display:'flex',
    flexDirection:'column',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  buttonWrapper: {
    marginHorizontal: 8,
  },
  button: {
    backgroundColor: 'rgba(182, 45, 37, 1)',
    color: '#fff',
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    textAlign: 'center',
    fontWeight:'bold',
  },
});

export default HomeScreen;