import {Dimensions, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#282828',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: Dimensions.get('window').height * 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  createNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  createNewText: {
    color: '#ff0000',
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '600',
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'space-between',
  },
  playlistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playlistImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  placeholderImage: {
    backgroundColor: '#404040',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistDetails: {
    marginLeft: 15,
    flex: 1,
  },
  playlistName: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  songCount: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 20,
  },
  loader: {
    padding: 20,
  },
  createNewSection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  input: {
    backgroundColor: '#404040',
    color: '#fff',
    padding: 12,
    borderRadius: 4,
    marginBottom: 15,
  },
  createButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#404040',
  },
  createButton: {
    backgroundColor: '#ff0000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
export default styles;
