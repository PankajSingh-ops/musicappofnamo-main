import { Platform, StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
    },
    menuOptions: {
      position: 'absolute',
      right: 48,
      top: 16,
      backgroundColor: '#333',
      borderRadius: 8,
      elevation: 5,
      padding: 8,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
      },
      modalContent: {
        backgroundColor: '#1A1A1A',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        minHeight: '50%',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
      },
      imagePickerContainer: {
        width: '100%',
        height: 200,
        backgroundColor: '#333',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        overflow: 'hidden',
      },
      selectedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
      },
      imagePickerText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
      },
      input: {
        backgroundColor: '#333',
        borderRadius: 8,
        padding: 15,
        color: '#fff',
        fontSize: 16,
        marginBottom: 20,
      },
      modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
      },
      modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
      },
      cancelButton: {
        backgroundColor: '#333',
      },
      createButton: {
        backgroundColor: '#1DB954', // Spotify green
      },
      cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
      },
      createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
      },
    actionSheetOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    actionSheetContainer: {
      backgroundColor: '#282828',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 34, // Add extra padding for iPhone home indicator
    },
    actionSheetHeader: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#383838',
    },
    actionSheetTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 4,
    },
    actionSheetSubtitle: {
      fontSize: 14,
      color: '#b3b3b3',
    },
    actionSheetOptions: {
      paddingVertical: 8,
    },
    actionSheetOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    actionSheetOptionText: {
      fontSize: 16,
      color: '#fff',
      marginLeft: 16,
    },
    actionSheetOptionDanger: {
      color: '#E72F2E',
    },
    actionSheetCancelButton: {
      marginTop: 8,
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#383838',
    },
    actionSheetCancelText: {
      fontSize: 16,
      color: '#b3b3b3',
      textAlign: 'center',
      fontWeight: '600',
    },
    menuOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
    },
    menuText: {
      color: '#fff',
      marginLeft: 8,
      fontSize: 16,
    },
    headerContainer: {
      backgroundColor: '#1a1a1a',
      paddingBottom: 16,
    },
    backButton: {
      padding: 16,
    },
    profileSection: {
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 24,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 16,
      borderWidth: 3,
      borderColor: '#E72F2E',
    },
    profileName: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 16,
    },
    statsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#282828',
      padding: 16,
      borderRadius: 20,
      width: '80%',
    },
    stat: {
      flex: 1,
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
    },
    statLabel: {
      fontSize: 14,
      color: '#b3b3b3',
      marginTop: 4,
    },
    statDivider: {
      width: 1,
      height: 30,
      backgroundColor: '#404040',
    },
    playlistHeaderSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
    },
    addButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#E72F2E',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
    },
    playlistsContainer: {
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    playlistCard: {
      flexDirection: 'row',
      backgroundColor: '#282828',
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
      elevation: 3,
      alignItems: 'center',
    },
    playlistImage: {
      width: 80,
      height: 80,
    },
    playlistInfo: {
      flex: 1,
      padding: 16,
    },
    playlistName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 8,
    },
    playlistDetails: {
      fontSize: 14,
      color: '#b3b3b3',
    },
    moreButton: {
      padding: 16,
    },
   
    buttonText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 16,
    },
      modalCloseButton: {
        padding: 5,
      },
      modalContentKeyboardOpen: {
        marginBottom: Platform.OS === 'ios' ? 120 : 0,
      },
  });
  export default styles;