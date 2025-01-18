import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 20,
    },
    input: {
      marginBottom: 16,
      backgroundColor: '#1A1A1A',
    },
    label: {
      color: '#FFFFFF',
      marginBottom: 8,
      fontSize: 16,
    },
    uploadButton: {
      backgroundColor: '#1A1A1A',
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      alignItems: 'center',
    },
    uploadButtonText: {
      color: '#CA2B28',
      fontSize: 16,
      fontWeight: '600',
    },
    mediaPreviewContainer: {
      marginBottom: 16,
    },
    previewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    previewLabel: {
      color: '#FFFFFF',
      fontSize: 14,
    },
    previewImage: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      backgroundColor: '#1A1A1A',
    },
    pickerContainer: {
      marginBottom: 16,
    },
    pickerWrapper: {
      backgroundColor: '#1A1A1A',
      borderRadius: 8,
      overflow: 'hidden',
    },
    picker: {
      color: '#FFFFFF',
      height: 50,
      width: '100%',
      marginTop: Platform.OS === 'ios' ? 0 : -8,
    },
    dateTimeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    dateTimeButton: {
      flex: 1,
      backgroundColor: '#1A1A1A',
      padding: 16,
      borderRadius: 8,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dateTimeText: {
      color: '#FFFFFF',
      fontSize: 16,
    },
    publishButton: {
      backgroundColor: '#CA2B28',
      padding: 16,
      borderRadius: 8,
      marginVertical: 24,
      alignItems: 'center',
    },
    publishButtonDisabled: {
      backgroundColor: '#8B1D1B',
    },
    publishButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    videoPreviewContainer: {
      backgroundColor: '#1A1A1A',
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    videoContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    videoFileName: {
      color: '#FFFFFF',
      marginLeft: 12,
      fontSize: 14,
      flex: 1,
    },
    loaderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      color: '#FFFFFF',
      marginLeft: 8,
      fontSize: 16,
      fontWeight: '600',
    },
  });
  export default styles;