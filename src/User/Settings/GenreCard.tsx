import React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, Dimensions, View } from 'react-native';
import { Genre } from '../../../type';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface GenreCardProps {
  genre: Genre;
}

const GenreCard: React.FC<GenreCardProps> = ({ genre }) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('GenreDetails', { genre })}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={genre.image} 
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <View style={styles.contentContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {genre.name}
            </Text>
            <View style={styles.songsContainer}>
              <Text style={styles.songs}>
                {genre.totalSongs.toLocaleString()} songs
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: Dimensions.get('window').width / 2 - 24,
    margin: 8,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  contentContainer: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  songsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  songs: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
});

export default GenreCard;