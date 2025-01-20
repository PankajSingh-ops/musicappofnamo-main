import {Dimensions, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#282828',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: Dimensions.get('window').height * 0.7,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  trackTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trackArtist: {
    color: '#b3b3b3',
    fontSize: 16,
  },
  optionsList: {
    padding: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
  },
  optionLabel: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  progressBar: {
    height: 2,
    backgroundColor: '#404040',
    borderRadius: 1,
    marginTop: 8,
    width: '100%',
  },
  progress: {
    height: '100%',
    backgroundColor: '#1DB954',
    borderRadius: 1,
  },
});
export default styles;
