import {Dimensions, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  artworkWrapper: {
    position: 'relative',
    alignItems: 'center',
    marginTop: 20,
  },
  progressContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  progressBarContainer: {
    height: 30,
    justifyContent: 'center',
    position: 'relative',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#404040',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#E9302F',
    borderRadius: 2,
  },
  seekThumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#E9302F',
    borderRadius: 6,
    top: '50%',
    marginTop: -6,
    transform: [{translateX: -6}],
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  time: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  mirrorEffect: {
    position: 'absolute',
    bottom: -100,
    width: Dimensions.get('window').width - 80,
    height: (Dimensions.get('window').width - 80) / 2,
    backgroundColor: 'transparent',
    transform: [{scaleY: -1}],
    opacity: 0.4,
    borderRadius: 20,
    zIndex: -1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'center',
    padding: 10,
  },
  artworkContainer: {
    alignItems: 'center',
    marginTop: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 15,
  },

  artwork: {
    width: Dimensions.get('window').width - 80,
    height: Dimensions.get('window').width - 80,
    borderRadius: 20,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  artist: {
    color: '#b3b3b3',
    fontSize: 18,
    marginTop: 5,
  },
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Changed from space-around
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#404040',
  },
  interactionButton: {
    alignItems: 'center',
    paddingHorizontal: 8,
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  interactionCount: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  controlsContainer: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#282828',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
    maxHeight: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: 8,
  },
  mainControls: {
    marginTop: 30,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeControl: {
    backgroundColor: '#E9302F',
    transform: [{scale: 1.1}],
  },
  playPauseButton: {
    backgroundColor: '#E9302F',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1DB954',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    transform: [{scale: 1.1}],
  },
});
export default styles;
