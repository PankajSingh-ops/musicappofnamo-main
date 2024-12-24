import React from 'react';
import { View, StyleSheet } from 'react-native';
import GlobalPlayer from './src/Music Player/GlobalPlayer';
import { useMusicPlayer } from './src/Music Player/MusicContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlayback, 
    skipToNext, 
    skipToPrevious 
  } = useMusicPlayer();

  const handleToggleFavorite = () => {
    // Implement favorite toggling logic
    console.log('Toggle favorite');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>
      {currentTrack && (
        <GlobalPlayer
          currentTrack={currentTrack}
          onPlayPause={togglePlayback}
          isPlaying={isPlaying}
          onNext={skipToNext}
          onPrevious={skipToPrevious}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => {/* Implement close logic */}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default AppLayout;