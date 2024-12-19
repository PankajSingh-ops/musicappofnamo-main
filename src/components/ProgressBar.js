import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useProgress } from 'react-native-track-player';

export const ProgressBar = () => {
  const progress = useProgress();
  
  return (
    <View style={styles.progressContainer}>
      <Text style={styles.progressText}>
        {new Date(progress.position * 1000).toISOString().substr(14, 5)}
      </Text>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressIndicator,
            { width: `${(progress.position / progress.duration) * 100}%` },
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        {new Date(progress.duration * 1000).toISOString().substr(14, 5)}
      </Text>
    </View>
  );
};
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    playerContainer: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 30,
    },
    controls: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    button: {
      padding: 15,
      backgroundColor: '#007AFF',
      borderRadius: 10,
      marginHorizontal: 10,
    },
    playButton: {
      padding: 20,
      backgroundColor: '#007AFF',
      borderRadius: 40,
      marginHorizontal: 20,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    progressBar: {
      flex: 1,
      height: 4,
      backgroundColor: '#ddd',
      marginHorizontal: 10,
      borderRadius: 2,
    },
    progressIndicator: {
      height: '100%',
      backgroundColor: '#007AFF',
      borderRadius: 2,
    },
    progressText: {
      fontSize: 12,
      color: '#666',
    },
  });