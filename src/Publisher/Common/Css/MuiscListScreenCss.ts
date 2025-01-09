import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 16,
    backgroundColor: '#121212',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282828',
    borderRadius: 8,
    padding: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  genreFilter: {
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
    height: 100,
  },
  genreButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: 'rgba(40, 40, 40, 0.8)', // Slightly transparent
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // Subtle border
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    minHeight:50,
    maxHeight:80 // Ensure minimum width for better spacing
  },
  genreButtonActive: {
    backgroundColor: '#1DB954',
    borderColor: '#1DB954',
  },
  genreButtonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'System', // Use system font
    letterSpacing: 0.5, // Better text spacing
  },
  genreButtonTextActive: {
    fontWeight: '600',
    color: '#fff',
  },
  list: {
    padding: 16,
    paddingTop: 8, // Reduced top padding since genre filter has margin
  },
  musicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282828',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  artwork: {
    width: 56,
    height: 56,
    borderRadius: 4,
  },
  musicInfo: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  artist: {
    color: '#b3b3b3',
    fontSize: 14,
    marginTop: 4,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  genre: {
    color: '#777',
    fontSize: 12,
  },
  badge: {
    backgroundColor: '#1DB954',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  moreButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    color: '#777',
    fontSize: 16,
    marginTop: 16,
  },
  listWithPlayer: {
    paddingBottom: 90, // Add space for the player
  },
  playerContainer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    backgroundColor: '#282828',
    borderTopWidth: 1,
    borderTopColor: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playingTrackText: {
    color: '#1DB954',
    fontWeight: 'bold',
  },
});
export default styles;
