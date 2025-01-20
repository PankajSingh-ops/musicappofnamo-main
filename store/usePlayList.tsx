import {create} from 'zustand';
import axios from 'axios';

interface Song {
  id: number | string;
  title: string;
  artist: string;
  duration: number;
}

interface Playlist {
  id: number;
  name: string;
  imageUrl: string | null;
  creator: string;
  totalSongs: number;
  songs?: Song[];
}

interface PlaylistState {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  loading: boolean;
  error: string | null;
  creating: boolean;
  updating: boolean;
  deleting: boolean;

  // Playlist Actions
  fetchPlaylists: (token: string) => Promise<void>;
  fetchPlaylistById: (token: string, playlistId: number) => Promise<void>;
  createPlaylist: (
    token: string,
    name: string,
    trackId?: number | string,
  ) => Promise<Playlist>;
  updatePlaylist: (
    token: string,
    playlistId: number,
    name: string,
    imageFile?: any,
  ) => Promise<void>;
  deletePlaylist: (token: string, playlistId: number) => Promise<void>;

  // Song Actions
  addTrackToPlaylist: (
    token: string,
    playlistId: number,
    trackId: number | string,
  ) => Promise<void>;
  removeTrackFromPlaylist: (
    token: string,
    playlistId: number,
    trackId: number | string,
  ) => Promise<void>;
  reorderPlaylistTracks: (
    token: string,
    playlistId: number,
    startIndex: number,
    endIndex: number,
  ) => Promise<void>;

  // State Actions
  setCurrentPlaylist: (playlist: Playlist | null) => void;
  clearError: () => void;
  resetState: () => void;
}

const initialState = {
  playlists: [],
  currentPlaylist: null,
  loading: false,
  error: null,
  creating: false,
  updating: false,
  deleting: false,
};

const usePlaylistStore = create<PlaylistState>((set, get) => ({
  ...initialState,

  fetchPlaylists: async (token: string) => {
    set({loading: true, error: null});
    try {
      const response = await axios.get<Playlist[]>(
        'http://10.0.2.2:3000/api/playlists',
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      set({playlists: response.data, loading: false});
    } catch (error) {
      console.error('Error fetching playlists:', error);
      set({error: 'Failed to fetch playlists', loading: false});
    }
  },

  fetchPlaylistById: async (token: string, playlistId: number) => {
    set({loading: true, error: null});
    try {
      const response = await axios.get<Playlist>(
        `http://10.0.2.2:3000/api/playlists/${playlistId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      set({currentPlaylist: response.data, loading: false});
    } catch (error) {
      console.error('Error fetching playlist:', error);
      set({error: 'Failed to fetch playlist', loading: false});
    }
  },

  createPlaylist: async (
    token: string,
    name: string,
    imageFile?: any,  // Changed trackId to imageFile
) => {
    set({creating: true, error: null});
    try {
        let imageUrl = null;
        
        // Handle image upload first if provided
        if (imageFile) {
            const formData = new FormData();
            formData.append('file', {
                uri: imageFile,
                type: 'image/jpeg',
                name: 'image.jpg',
            });

            const imageResponse = await axios.post(
                'http://10.0.2.2:3000/api/playlists/upload/image',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            imageUrl = imageResponse.data.url;
        }

        // Create playlist with image URL if available
        const response = await axios.post<Playlist>(
            'http://10.0.2.2:3000/api/playlists',
            { name, imageUrl },  // Include imageUrl in request
            { headers: { Authorization: `Bearer ${token}` } }
        );

        await get().fetchPlaylists(token);
        set({creating: false});
        return response.data;
    } catch (error) {
        console.error('Error creating playlist:', error);
        set({error: 'Failed to create playlist', creating: false});
        throw error;
    }
},


updatePlaylist: async (
  token: string,
  playlistId: number,
  name: string,
  imageFile?: any,
) => {
  set({updating: true, error: null});
  try {
      let imageUrl = null;

      // Only attempt image upload if new image is provided
      if (imageFile && imageFile !== '') {
          try {
              const formData = new FormData();
              formData.append('file', {
                  uri: imageFile,
                  type: 'image/jpeg',
                  name: 'playlist-cover.jpg',
              });

              const imageResponse = await axios.post(
                  'http://10.0.2.2:3000/api/playlists/upload/image',
                  formData,
                  {
                      headers: {
                          Authorization: `Bearer ${token}`,
                          'Content-Type': 'multipart/form-data',
                      },
                      timeout: 10000, // 10 second timeout
                  }
              );
              imageUrl = imageResponse.data.url;
          } catch (uploadError) {
              console.error('Image upload error:', uploadError);
              throw new Error('Failed to upload image. Please try again.');
          }
      }

      // Update playlist with new data
      const updateResponse = await axios.put(
          `http://10.0.2.2:3000/api/playlists/${playlistId}`,
          { 
              name, 
              imageUrl: imageUrl || undefined // Only include if new image was uploaded
          },
          {
              headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
              timeout: 5000, // 5 second timeout
          }
      );

      // Refresh playlists after successful update
      await get().fetchPlaylists(token);
      if (get().currentPlaylist?.id === playlistId) {
          await get().fetchPlaylistById(token, playlistId);
      }

      set({updating: false});
      return updateResponse.data;
  } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update playlist';
      console.error('Detailed update error:', error);
      set({error: errorMessage, updating: false});
      throw error;
  }
},

  deletePlaylist: async (token: string, playlistId: number) => {
    set({deleting: true, error: null});
    try {
      await axios.delete(`http://10.0.2.2:3000/api/playlists/${playlistId}`, {
        headers: {Authorization: `Bearer ${token}`},
      });

      set(state => ({
        playlists: state.playlists.filter(
          playlist => playlist.id !== playlistId,
        ),
        currentPlaylist:
          state.currentPlaylist?.id === playlistId
            ? null
            : state.currentPlaylist,
        deleting: false,
      }));
    } catch (error) {
      console.error('Error deleting playlist:', error);
      set({error: 'Failed to delete playlist', deleting: false});
      throw error;
    }
  },

  addTrackToPlaylist: async (
    token: string,
    playlistId: number,
    trackId: number | string,
  ) => {
    try {
      await axios.post(
        `http://10.0.2.2:3000/api/playlists/${playlistId}/songs`,
        {songId: trackId},
        {headers: {Authorization: `Bearer ${token}`}},
      );

      // Refresh both playlist lists and current playlist if needed
      await get().fetchPlaylists(token);
      if (get().currentPlaylist?.id === playlistId) {
        await get().fetchPlaylistById(token, playlistId);
      }
    } catch (error) {
      console.error('Error adding track to playlist:', error);
      throw error;
    }
  },

  removeTrackFromPlaylist: async (
    token: string,
    playlistId: number,
    trackId: number | string,
  ) => {
    try {
      await axios.delete(
        `http://10.0.2.2:3000/api/playlists/${playlistId}/songs/${trackId}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );

      // Refresh both playlist lists and current playlist if needed
      await get().fetchPlaylists(token);
      if (get().currentPlaylist?.id === playlistId) {
        await get().fetchPlaylistById(token, playlistId);
      }
    } catch (error) {
      console.error('Error removing track from playlist:', error);
      throw error;
    }
  },

  reorderPlaylistTracks: async (
    token: string,
    playlistId: number,
    startIndex: number,
    endIndex: number,
  ) => {
    try {
      await axios.put(
        `http://10.0.2.2:3000/api/playlists/${playlistId}/reorder`,
        {startIndex, endIndex},
        {headers: {Authorization: `Bearer ${token}`}},
      );

      // Refresh current playlist to get new order
      if (get().currentPlaylist?.id === playlistId) {
        await get().fetchPlaylistById(token, playlistId);
      }
    } catch (error) {
      console.error('Error reordering playlist tracks:', error);
      throw error;
    }
  },

  setCurrentPlaylist: (playlist: Playlist | null) => {
    set({currentPlaylist: playlist});
  },

  clearError: () => {
    set({error: null});
  },

  resetState: () => {
    set(initialState);
  },
}));

export default usePlaylistStore;
