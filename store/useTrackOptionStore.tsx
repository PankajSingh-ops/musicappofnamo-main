import {create} from 'zustand';
import {Track} from '../type';
import {Platform, Alert, PermissionsAndroid} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFavoritesStore } from './userFavouriteStpre';

interface TrackOptionsState {
  visibleTrackId: string | null;
  showPlaylistModal: boolean;
  downloadProgress: number;
  isFavorited: boolean;
  // Actions
  setVisibleTrack: (trackId: string | null) => void;
  setShowPlaylistModal: (show: boolean) => void;
  setDownloadProgress: (progress: number) => void;
  setIsFavorited: (favorited: boolean) => void;
  // Async actions
  checkFavoriteStatus: (track: Track, token: string) => Promise<void>;
  handleLike: (track: Track, token: string) => Promise<void>;
  handleDownload: (track: Track, token: string) => Promise<void>;
}

export const useTrackOptionsStore = create<TrackOptionsState>((set, get) => ({
  visibleTrackId: null,
  showPlaylistModal: false,
  downloadProgress: 0,
  isFavorited: false,

  setVisibleTrack: (trackId) => set({ visibleTrackId: trackId }),
  setShowPlaylistModal: (show) => set({ showPlaylistModal: show }),
  setDownloadProgress: (progress) => set({ downloadProgress: progress }),
  setIsFavorited: (favorited) => set({ isFavorited: favorited }),

  checkFavoriteStatus: async (track, token) => {
    try {
      const response = await fetch(
        `http://10.0.2.2:3000/api/favorites/check/${track.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error('Failed to check favorite status');

      const data = await response.json();
      set({ isFavorited: data.isFavorited });
    } catch (error) {
      console.error('Error checking favorite status:', error);
      Alert.alert('Error', 'Failed to check favorite status');
    }
  },

  handleLike: async (track, token) => {
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
        body: method === 'POST' ? JSON.stringify({musicId: track.id}) : undefined,
      });

      if (!response.ok) throw new Error('Failed to update favorite');

      const data = await response.json();
      set({ isFavorited: !isFavorited });
      
      // After successfully updating the like status, fetch updated favorites
      await useFavoritesStore.getState().fetchFavorites(token);
      
      Alert.alert('Success', data.message);
    } catch (error) {
      console.error('Error updating favorite:', error);
      Alert.alert('Error', 'Failed to update favorites');
    }
  },


  handleDownload: async (track, token) => {
    const checkPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to storage to download songs',
              buttonPositive: 'OK',
            },
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.error('Permission error:', err);
          return false;
        }
      }
      return true;
    };

    const hasPermission = await checkPermissions();
    if (!hasPermission) {
      Alert.alert('Error', 'Storage permission is required to download songs');
      return;
    }

    try {
      const response = await fetch(
        `http://10.0.2.2:3000/api/downloads/${track.id}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error('Failed to initiate download');

      const data = await response.json();
      const {dirs} = RNFetchBlob.fs;
      const dirPath = Platform.select({
        ios: dirs.DocumentDir,
        android: dirs.DownloadDir,
      });

      const filename = `${track.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`;
      const filePath = `${dirPath}/MyMusicApp/${filename}`;

      await RNFetchBlob.fs.mkdir(`${dirPath}/MyMusicApp`);

      const downloadTask = RNFetchBlob.config({
        path: filePath,
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: `Downloading ${track.title}`,
          description: 'Downloading song...',
          mime: 'audio/mpeg',
          mediaScannable: true,
          path: filePath,
        },
      }).fetch('GET', data.downloadUrl, {
        Authorization: `Bearer ${token}`,
      });

      downloadTask
        .progress((received, total) => {
          const progress = (received / total) * 100;
          set({ downloadProgress: progress });
        })
        .then(async res => {
          const downloads = await AsyncStorage.getItem('downloadedTracks');
          const downloadedTracks = downloads ? JSON.parse(downloads) : [];

          downloadedTracks.push({
            id: track.id,
            title: track.title,
            artist: track.artist,
            artwork: track.artwork,
            filePath: res.path(),
            downloadedAt: new Date().toISOString(),
          });

          await AsyncStorage.setItem(
            'downloadedTracks',
            JSON.stringify(downloadedTracks),
          );

          Alert.alert(
            'Success',
            'Song downloaded successfully! You can access it from the Downloads section.',
          );
        })
        .catch(error => {
          console.error('Download failed:', error);
          Alert.alert('Error', 'Failed to download the song');
        })
        .finally(() => {
          set({ downloadProgress: 0 });
        });
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download the song');
    }
  },
}));