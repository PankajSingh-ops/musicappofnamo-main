import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
  },

  recentContainer: {
    marginBottom: 24,
  },
  recentCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  recentImageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  recentImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  trackInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  recentTrackTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recentArtistName: {
    color: '#CCCCCC',
    fontSize: 14,
  },

  // Keep all existing styles
  topBar: {
    margin: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barsIcon: {
    color: '#FFFFFF', // default color
  },
  barsIconActive: {
    color: '#B62D25', // active color
  },
  albumImg: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  artistImg: {
    width: 130,
    height: 130,
    borderRadius: 75,
  },
  wishing: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  time: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signal: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    width: '70%',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 5,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 10,
    padding: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  categoryContent: {
    paddingRight: 16,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#222',
    marginRight: 8,
  },
  activePill: {
    backgroundColor: '#B62D25',
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  activeText: {
    color: '#FFFFFF',
  },
  popularSongsContainer: {
    flexDirection: 'row',
  },
  albumCard: {
    marginRight: 12,
    width: 120,
  },
  artistSecCard: {
    marginRight: 16,
    width: 130,
  },
  songCard: {
    width: 90,
    flex:1, 
    alignItems:'center',
  },
  playlistArt: {
    width: '10%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  albumArt: {
    width: '10%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  albumTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  songTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  favArtistName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  albumArtist: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  artistName: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  songTitleSong: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  artistNameSong: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
  },
});
export default styles;
