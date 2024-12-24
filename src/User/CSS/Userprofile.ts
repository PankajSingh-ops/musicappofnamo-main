import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
    },
    header: {
      padding: 20,
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
      backgroundColor: '#282828',
    },
    headerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 150,
      backgroundColor: '#404040',
    },
    profileImageContainer: {
      position: 'relative',
      alignSelf: 'center',
      marginBottom: 15,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 4,
      borderColor: '#121212',
    },
    imageEditBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: '#4A90E2',
      borderRadius: 12,
      padding: 6,
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    imageLoadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    datePickerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#2C2C2E',
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    datePickerButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
    },
    picker: {
      width: '100%',
      backgroundColor: '#2C2C2E',
      marginBottom: 16,
    },
    premiumBadge: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: '#282828',
      borderRadius: 12,
      padding: 4,
      borderWidth: 2,
      borderColor: '#FFD700',
    },
    userInfo: {
      alignItems: 'center',
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    username: {
      fontSize: 16,
      color: '#B3B3B3',
      marginBottom: 8,
    },
    bio: {
      fontSize: 14,
      color: '#B3B3B3',
      textAlign: 'center',
      marginBottom: 15,
      paddingHorizontal: 20,
    },
    statsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    stat: {
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    statNumber: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    statLabel: {
      fontSize: 12,
      color: '#B3B3B3',
      marginTop: 4,
    },
    statDivider: {
      width: 1,
      height: 30,
      backgroundColor: '#404040',
    },
    detailsContainer: {
      padding: 20,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#282828',
    },
    detailContent: {
      flex: 1,
    },
    detailLabel: {
      fontSize: 14,
      color: '#B3B3B3',
      marginBottom: 4,
    },
    detailValue: {
      fontSize: 16,
      color: '#FFFFFF',
    },
    editButton: {
      padding: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#282828',
      borderRadius: 12,
      padding: 20,
      width: '90%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 16,
    },
    input: {
      backgroundColor: '#404040',
      borderRadius: 8,
      padding: 12,
      color: '#FFFFFF',
      fontSize: 16,
      marginBottom: 16,
    },
    multilineInput: {
      height: 100,
      textAlignVertical: 'top',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    modalButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      marginLeft: 12,
    },
    cancelButton: {
      backgroundColor: '#404040',
    },
    saveButton: {
      backgroundColor: '#4A90E2',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '500',
    },
    pickerContainer: {
      backgroundColor: '#404040',
      borderRadius: 8,
      marginBottom: 16,
    },
    countryPickerModal: {
      height: '70%',
      maxHeight: 600,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#404040',
      borderRadius: 8,
      marginBottom: 16,
      paddingHorizontal: 12,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      color: '#FFFFFF',
      padding: 12,
      fontSize: 16,
    },
    countryList: {
      marginBottom: 16,
    },
    countryItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#404040',
    },
    countryItemText: {
      color: '#FFFFFF',
      fontSize: 16,
    },
    countryPickerButton: {
      backgroundColor: '#404040',
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    countryPickerButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
    },
  });

export default styles;
