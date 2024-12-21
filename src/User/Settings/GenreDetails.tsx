import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  Dimensions, 
  StatusBar,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../type';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = width * 0.7;

type GenreDetailsProps = NativeStackScreenProps<RootStackParamList, 'GenreDetails'>;

const GenreDetails = ({ route, navigation }: GenreDetailsProps) => {
  const { genre }:any = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerContainer}>
          <Image source={genre.image} style={styles.headerImage} />
          <View style={styles.headerOverlay} />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{genre.name}</Text>
          <Text style={styles.songCount}>
            {genre.totalSongs.toLocaleString()} songs
          </Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.playButton}>
              <Icon name="play" size={24} color="white" />
              <Text style={styles.playButtonText}>Play All</Text>
            </TouchableOpacity>
            
            <View style={styles.secondaryButtons}>
              <TouchableOpacity style={styles.iconButton}>
                <Icon name="heart-outline" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Icon name="share-social-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>About this genre</Text>
            <Text style={styles.description}>
              Explore the best of {genre.name} music with our carefully curated collection
              of {genre.totalSongs.toLocaleString()} tracks. From classics to latest hits,
              immerse yourself in the rhythm and soul of this genre.
            </Text>
          </View>

          <View style={styles.popularSongs}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Songs</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllButton}>See All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    position: 'relative',
    height: HEADER_HEIGHT,
  },
  headerImage: {
    width: width,
    height: HEADER_HEIGHT,
    resizeMode: 'cover',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  songCount: {
    fontSize: 16,
    color: '#B3B3B3',
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1DB954',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  playButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#B3B3B3',
  },
  popularSongs: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  seeAllButton: {
    color: '#1DB954',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default GenreDetails;