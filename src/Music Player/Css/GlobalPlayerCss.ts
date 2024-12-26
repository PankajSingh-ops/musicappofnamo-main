import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    playerContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#282828',
      borderTopWidth: 1,
      borderTopColor: '#404040',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    playerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 12,
      paddingBottom: 16,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: 12,
    },
    playerImage: {
      width: 48,
      height: 48,
      borderRadius: 8,
      backgroundColor: '#404040',
    },
    playerInfo: {
      flex: 1,
      marginLeft: 12,
      justifyContent: 'center',
    },
    playerTitle: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 2,
    },
    playerArtist: {
      color: '#b3b3b3',
      fontSize: 14,
    },
    playerControls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    controlButton: {
      padding: 8,
      marginHorizontal: 2,
    },
    playPauseButton: {
      padding: 8,
      marginHorizontal: 2,
      backgroundColor: 'transparent',
      borderRadius: 20,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    favoriteButton: {
      marginLeft: 4,
    },
  });
export default styles;

