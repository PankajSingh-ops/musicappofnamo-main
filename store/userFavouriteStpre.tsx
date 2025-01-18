import {create} from 'zustand';
import { Track } from '../type';

interface FavoritesState {
  favorites: Track[];
  isLoading: boolean;
  isEditMode: boolean;
  setFavorites: (favorites: Track[]) => void;
  addFavorite: (track: Track) => void;
  removeFavorite: (trackId: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsEditMode: (isEditMode: boolean) => void;
  fetchFavorites: (token: string) => Promise<void>;
  toggleFavorite: (track: Track, token: string) => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: true,
  isEditMode: false,

  setFavorites: (favorites) => set({ favorites }),
  addFavorite: (track) => set((state) => ({ 
    favorites: [...state.favorites, track] 
  })),
  removeFavorite: (trackId) => set((state) => ({ 
    favorites: state.favorites.filter(track => track.id !== trackId) 
  })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsEditMode: (isEditMode) => set({ isEditMode }),

  fetchFavorites: async (token) => {
    if (!token) {
      set({ favorites: [], isLoading: false });
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:3000/api/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      set({ favorites: data.favorites, isLoading: false });
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  },

  toggleFavorite: async (track, token) => {
    if (!token) return;

    const state = get();
    const isFavorite = state.favorites.some(fav => fav.id === track.id);

    try {
      if (isFavorite) {
        const response = await fetch(`http://10.0.2.2:3000/api/favorites/${track.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to remove from favorites');
        state.removeFavorite(track.id);
      } else {
        const response = await fetch('http://10.0.2.2:3000/api/favorites', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trackId: track.id }),
        });

        if (!response.ok) throw new Error('Failed to add to favorites');
        state.addFavorite(track);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },
}));