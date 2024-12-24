import React, { createContext, useContext, useEffect } from 'react';
import { musicPlayerService, usePlayerState } from './MuiscPlayerService';
import { Track } from '../../type';

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track, playlist: Track[]) => Promise<void>;
  togglePlayback: () => Promise<void>;
  skipToNext: () => Promise<void>;
  skipToPrevious: () => Promise<void>;
}

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isPlaying, currentTrack, setIsPlaying, setCurrentTrack } = usePlayerState();

  useEffect(() => {
    const initializePlayer = async () => {
      await musicPlayerService.initialize();
    };
    initializePlayer();
  }, []);

  const playTrack = async (track: Track, playlist: Track[]) => {
    await musicPlayerService.playTrack(track, playlist);
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlayback = async () => {
    await musicPlayerService.togglePlayback();
  };

  const skipToNext = async () => {
    await musicPlayerService.skipToNext();
  };

  const skipToPrevious = async () => {
    await musicPlayerService.skipToPrevious();
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playTrack,
        togglePlayback,
        skipToNext,
        skipToPrevious,
      }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicProvider');
  }
  return context;
};