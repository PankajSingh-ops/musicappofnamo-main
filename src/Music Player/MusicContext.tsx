import React, { createContext, useContext, useEffect, useState } from 'react';
import { musicPlayerService, usePlayerState } from './MuiscPlayerService';
import { Track } from '../../type';

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  isShuffled: boolean;
  repeatMode: 'off' | 'track' | 'queue';
  playTrack: (track: Track, playlist: Track[]) => Promise<void>;
  togglePlayback: () => Promise<void>;
  skipToNext: () => Promise<void>;
  skipToPrevious: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  toggleShuffle: () => Promise<void>;
  toggleRepeat: () => Promise<void>;
}

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isPlaying, currentTrack, setIsPlaying, setCurrentTrack } = usePlayerState();
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'track' | 'queue'>('off');

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

  const seekTo = async (position: number) => {
    await musicPlayerService.seekTo(position);
  };

  const toggleShuffle = async () => {
    const newShuffleState = !isShuffled;
    setIsShuffled(newShuffleState);
    await musicPlayerService.setShuffleMode(newShuffleState);
  };

  const toggleRepeat = async () => {
    const modes: ('off' | 'track' | 'queue')[] = ['off', 'track', 'queue'];
    const currentIndex = modes.indexOf(repeatMode);
    const newMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(newMode);
    await musicPlayerService.setRepeatMode(newMode);
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isShuffled,
        repeatMode,
        playTrack,
        togglePlayback,
        skipToNext,
        skipToPrevious,
        seekTo,
        toggleShuffle,
        toggleRepeat,
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