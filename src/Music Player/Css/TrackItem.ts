import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  trackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282828',
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
  },
  selectedTrack: {
    backgroundColor: '#CA2B28',
  },
  imageContainer: {
    position: 'relative',
  },
  trackImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  trackDetails: {
    flex: 1,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trackArtist: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  removeButton: {
    marginLeft: 10,
  },
  optionsButton: {
    padding: 10,
  },
});
export default styles;
