import {create} from 'zustand';
import {Track} from '../type';
import {Alert} from 'react-native';
import { useFavoritesStore } from './userFavouriteStpre';

interface GlobalPlayerState {
  isExpanded: boolean;
  playTime: number;
  isFavorited: boolean;
  playCountTimer: NodeJS.Timeout | null;
  // Actions
  setIsExpanded: (expanded: boolean) => void;
  setPlayTime: (time: number) => void;
  setPlayCountTimer: (timer: NodeJS.Timeout | null) => void;
  resetPlayTime: () => void;
  clearPlayCountTimer: () => void;
  // Async actions
  updatePlayCount: (track: Track | null, token: string) => Promise<void>;
  checkFavoriteStatus: (track: Track | null, token: string) => Promise<void>;
  handleToggleFavorite: (
    track: Track | null,
    token: string,
    onToggleFavorite: () => void,
  ) => Promise<void>;
}

export const useGlobalPlayerStore = create<GlobalPlayerState>((set, get) => ({
  isExpanded: false,
  playTime: 0,
  isFavorited: false,
  playCountTimer: null,

  setIsExpanded: (expanded) => set({ isExpanded: expanded }),
  setPlayTime: (time) => set({ playTime: time }),
  setPlayCountTimer: (timer) => set({ playCountTimer: timer }),
  
  resetPlayTime: () => {
    set({ playTime: 0 });
    const {playCountTimer} = get();
    if (playCountTimer) {
      clearTimeout(playCountTimer);
      set({ playCountTimer: null });
    }
  },

  clearPlayCountTimer: () => {
    const {playCountTimer} = get();
    if (playCountTimer) {
      clearTimeout(playCountTimer);
      set({ playCountTimer: null });
    }
  },

  updatePlayCount: async (track, token) => {
    if (!track || !token) return;

    try {
      const response = await fetch(
        `http://10.0.2.2:3000/api/play-count/${track.id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error('Failed to update play count');
    } catch (error) {
      console.error('Error updating play count:', error);
    }
  },

  checkFavoriteStatus: async (track, token) => {
    if (!track || !token) return;

    try {
      const response = await fetch(
        `http://10.0.2.2:3000/api/favorites/check/${track.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error('Failed to check favorite status');

      const data = await response.json();
      set({ isFavorited: data.isFavorited });
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  },

  handleToggleFavorite: async (track, token, onToggleFavorite) => {
    if (!track || !token) {
      Alert.alert('Error', 'Please log in to add favorites');
      return;
    }

    const {isFavorited} = get();

    try {
      const method = isFavorited ? 'DELETE' : 'POST';
      const url = isFavorited
        ? `http://10.0.2.2:3000/api/favorites/${track.id}`
        : 'http://10.0.2.2:3000/api/favorites';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body:
          method === 'POST'
            ? JSON.stringify({musicId: track.id})
            : undefined,
      });

      if (!response.ok) throw new Error('Failed to update favorite');

      set({ isFavorited: !isFavorited });
      onToggleFavorite(); // Notify parent component
      
      // Update the favorites list using the correct store
      await useFavoritesStore.getState().fetchFavorites(token);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorite status');
    }
  },
}));