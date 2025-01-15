import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

const AddMusicAndAlbum = ({ navigation }:any) => {
  const windowWidth = Dimensions.get('window').width;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      return () => {
        scaleAnim.setValue(0.95);
        fadeAnim.setValue(0);
      };
    }, [])
  );

  const BoxComponent = ({ title, icon, onPress, color }) => (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.box,
          { width: windowWidth * 0.4, backgroundColor: color },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Icon name={icon} size={40} color="#fff" />
        </View>
        <Text style={styles.boxText}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Music Manager</Text>
      <View style={styles.boxContainer}>
        <BoxComponent
          title="Add Music"
          icon="music-note-plus"
          color="#FF4747"
          onPress={() => navigation.navigate('AddMusic')}
        />
        <BoxComponent
          title="Add Album"
          icon="album"
          color="#8E44AD"
          onPress={() => navigation.navigate('AddAlbums')}
        />
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Icon name="music" size={24} color="#FF4747" />
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Songs</Text>
        </View>
        <View style={styles.statBox}>
          <Icon name="album" size={24} color="#8E44AD" />
          <Text style={styles.statNumber}>6</Text>
          <Text style={styles.statLabel}>Albums</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 30,
    textShadowColor: 'rgba(255, 71, 71, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  box: {
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#FF4747',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    height: 180,
    overflow: 'hidden',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 50,
    marginBottom: 15,
  },
  boxText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    marginHorizontal: 10,
  },
  statBox: {
    alignItems: 'center',
    padding: 15,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default AddMusicAndAlbum;