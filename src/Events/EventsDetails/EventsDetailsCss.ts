import {Dimensions, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    height: 200,
    position: 'relative',
    marginTop: 16,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
  },
  hiddenVideo: {
    display: 'none',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -20}, {translateY: -20}],
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    padding: 10,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    height: 300,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: 300,
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  artistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  artistName: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 8,
    opacity: 0.9,
  },

  detailsContainer: {
    padding: 20,
  },
  infoSection: {
    marginBottom: 30,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  dateTimeContainer: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 12,
  },
  dateTime: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  timezone: {
    fontSize: 14,
    color: '#999',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 12,
  },
  location: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
    marginRight: 10,
  },
  ticketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  ticketDetail: {
    flex: 1,
  },
  ticketLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  ticketValue: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#E62F2E',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A', // Dark background to match theme
    minHeight: Dimensions.get('window').height,
  },

  // Error state styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 20,
    minHeight: Dimensions.get('window').height,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Roboto-Regular',
  },
  retryButton: {
    backgroundColor: '#E62F2E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Roboto-Medium',
  },
  joinButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 12,
  },
});
export default styles;
