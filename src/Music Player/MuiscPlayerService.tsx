import React from 'react';
import {useState} from 'react';
import TrackPlayer, {
  Event,
  State,
  useTrackPlayerEvents,
  Capability,
} from 'react-native-track-player';
import {Track} from '../../type';

// Interface for the service class
interface IMusicPlayerService {
  initialize(): Promise<void>;
  loadPlaylist(tracks: Track[], autoplay?: boolean): Promise<void>;
  playTrack(track: Track, playlistTracks: Track[]): Promise<void>;
  togglePlayback(): Promise<void>;
  skipToNext(): Promise<void>;
  skipToPrevious(): Promise<void>;
  getCurrentTrack(): Promise<Track | null>;
  seekTo(position: number): Promise<void>;
  getDuration(): Promise<number>;
  getPosition(): Promise<number>;
  stop(): Promise<void>;
}

class MusicPlayerService implements IMusicPlayerService {
  private static instance: MusicPlayerService;
  private isInitialized = false;
  private currentPlaylist: Track[] = [];

  private constructor() {}

  static getInstance(): MusicPlayerService {
    if (!MusicPlayerService.instance) {
      MusicPlayerService.instance = new MusicPlayerService();
    }
    return MusicPlayerService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await TrackPlayer.setupPlayer({
        maxBuffer: 1000, // Increase buffer size
        maxCacheSize: 1024 * 5, // 5mb cache
        waitForBuffer: true, // Wait for buffer before playing
        autoUpdateMetadata: true,
      });

      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
          Capability.SeekTo,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        progressUpdateEventInterval: 1,
        android: {
          appKilledPlaybackBehavior: 'StopPlaybackAndRemoveNotification',
          alwaysPauseOnInterruption: true,
        },
        ios: {
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
          backgroundMode: true,
        },
      });

      this.setupRemoteEvents();
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing player:', error);
      throw error;
    }
  }

  private setupRemoteEvents(): void {
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    TrackPlayer.addEventListener(Event.RemoteNext, () => this.skipToNext());
    TrackPlayer.addEventListener(Event.RemotePrevious, () =>
      this.skipToPrevious(),
    );
    TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.reset());
    TrackPlayer.addEventListener(Event.RemoteSeek, data =>
      TrackPlayer.seekTo(data.position),
    );
  }

  private formatTrack(track: Track) {
    // Clean up the duration if it's NaN
    let duration = 0;
    if (track.duration) {
      if (typeof track.duration === 'string') {
        // Try to parse MM:SS format
        const parts = track.duration.split(':');
        if (parts.length === 2) {
          duration = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
      } else if (!isNaN(track.duration)) {
        duration = track.duration;
      }
    }

    return {
      id: track.id.toString(), // Ensure ID is a string
      url: track.url,
      title: track.title || 'Unknown Title',
      artist: track.artist || 'Unknown Artist',
      artwork: track.artwork || undefined,
      duration: duration || 0, // Fallback to 0 if duration is invalid
      headers: {
        // Add headers for Cloudflare
        Accept: 'audio/mpeg',
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
      },
      pitchAlgorithm: 'LINEAR', // Add this for better audio processing
      progressUpdateEventInterval: 1, // Update progress more frequently
    };
  }

  async loadPlaylist(
    tracks: Track[],
    autoplay: boolean = false,
  ): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Get current queue to compare
      const currentQueue = await TrackPlayer.getQueue();
      const isNewPlaylist =
        !currentQueue.length ||
        !tracks.every((track, index) => track.id === currentQueue[index]?.id);

      if (isNewPlaylist) {
        let currentTrack = null;
        let currentPosition = 0;

        try {
          currentTrack = await this.getCurrentTrack();
          if (currentTrack) {
            currentPosition = await TrackPlayer.getPosition();
          }
        } catch (error) {
          console.log('No current track playing');
        }

        await TrackPlayer.reset();
        await TrackPlayer.add(tracks.map(this.formatTrack));
        this.currentPlaylist = tracks;

        if (currentTrack && autoplay) {
          const newIndex = tracks.findIndex(t => t.id === currentTrack.id);
          if (newIndex !== -1) {
            await TrackPlayer.skip(newIndex);
            await TrackPlayer.seekTo(currentPosition);
            await TrackPlayer.play();
          }
        }
      }

      if (autoplay && this.currentPlaylist.length > 0) {
        const playerState = await TrackPlayer.getState();
        if (playerState !== State.Playing) {
          await TrackPlayer.play();
        }
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('already been initialized')
      ) {
        // Ignore initialization error and continue
        console.log('Player already initialized, continuing...');
      } else {
        console.error('Error loading playlist:', error);
        throw error;
      }
    }
  }

  // 3. Also update the playTrack method:

  async playTrack(track: Track, playlistTracks: Track[]): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Format all tracks in the playlist
      const formattedTracks = playlistTracks.map(t => this.formatTrack(t));
      const formattedTrack = this.formatTrack(track);

      // Reset the player before loading new tracks
      await TrackPlayer.reset();

      // Add the formatted tracks to the queue
      await TrackPlayer.add(formattedTracks);

      // Find the index of the track to play
      const trackIndex = formattedTracks.findIndex(
        t => t.id === formattedTrack.id,
      );
      if (trackIndex !== -1) {
        await TrackPlayer.skip(trackIndex);
        await TrackPlayer.play().catch(playError => {
          console.warn('Play error:', playError);
          // Attempt to recover by retrying once
          return TrackPlayer.play();
        });
      } else {
        throw new Error('Track not found in playlist');
      }
    } catch (error) {
      console.error('Error in playTrack:', error);
      if (error instanceof Error) {
        // Add more specific error handling
        if (error.message.includes('already been initialized')) {
          console.log('Player already initialized, continuing...');
        } else if (error.message.includes('network')) {
          throw new Error(
            'Network error while loading track. Please check your connection.',
          );
        } else {
          throw new Error(`Failed to play track: ${error.message}`);
        }
      } else {
        throw new Error('An unknown error occurred while playing the track');
      }
    }
  }

  async togglePlayback(): Promise<void> {
    try {
      const state = await TrackPlayer.getState();
      if (state === State.Playing) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      throw error;
    }
  }

  async skipToNext(): Promise<void> {
    try {
      const queue = await TrackPlayer.getQueue();
      const currentTrack = await TrackPlayer.getCurrentTrack();
      if (currentTrack < queue.length - 1) {
        await TrackPlayer.skipToNext();
      }
    } catch (error) {
      console.error('Error skipping to next track:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      if (!this.isInitialized) {
        return;
      }

      // First pause any playing audio
      const state = await TrackPlayer.getState();
      if (state === State.Playing) {
        await TrackPlayer.pause();
      }

      // Reset the player (clears the queue and current track)
      await TrackPlayer.reset();

      // Clear the current playlist
      this.currentPlaylist = [];
    } catch (error) {
      console.error('Error stopping playback:', error);
      throw error;
    }
  }

  async skipToPrevious(): Promise<void> {
    try {
      const position = await TrackPlayer.getPosition();
      if (position > 3) {
        await TrackPlayer.seekTo(0);
      } else {
        await TrackPlayer.skipToPrevious();
      }
    } catch (error) {
      console.error('Error skipping to previous track:', error);
      throw error;
    }
  }

  async getCurrentTrack(): Promise<Track | null> {
    try {
      const trackIndex = await TrackPlayer.getCurrentTrack();
      if (trackIndex !== null) {
        const trackObject = await TrackPlayer.getTrack(trackIndex);
        return trackObject as Track;
      }
      return null;
    } catch (error) {
      console.error('Error getting current track:', error);
      throw error;
    }
  }

  async getDuration(): Promise<number> {
    try {
      return await TrackPlayer.getDuration();
    } catch (error) {
      console.error('Error getting duration:', error);
      throw error;
    }
  }

  async getPosition(): Promise<number> {
    try {
      return await TrackPlayer.getPosition();
    } catch (error) {
      console.error('Error getting position:', error);
      throw error;
    }
  }
  // Add these methods to your MusicPlayerService class

  async setShuffleMode(enabled: boolean): Promise<void> {
    try {
      if (enabled) {
        const queue = await TrackPlayer.getQueue();
        const currentTrack = await TrackPlayer.getCurrentTrack();
        const shuffledQueue = [...queue];

        if (currentTrack !== null) {
          const currentTrackItem = shuffledQueue.splice(currentTrack, 1)[0];

          // Fisher-Yates shuffle algorithm
          for (let i = shuffledQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledQueue[i], shuffledQueue[j]] = [
              shuffledQueue[j],
              shuffledQueue[i],
            ];
          }

          shuffledQueue.unshift(currentTrackItem);
        }

        await TrackPlayer.reset();
        await TrackPlayer.add(shuffledQueue);

        // Resume playing current track
        if (currentTrack !== null) {
          await TrackPlayer.skip(0);
          await TrackPlayer.play();
        }
      } else {
        const currentTrack = await this.getCurrentTrack();
        await this.loadPlaylist(this.currentPlaylist, false);

        if (currentTrack) {
          const newIndex = this.currentPlaylist.findIndex(
            t => t.id === currentTrack.id,
          );
          if (newIndex !== -1) {
            await TrackPlayer.skip(newIndex);
            await TrackPlayer.play();
          }
        }
      }
    } catch (error) {
      console.error('Error setting shuffle mode:', error);
      throw error;
    }
  }

  async setRepeatMode(mode: 'off' | 'track' | 'queue'): Promise<void> {
    try {
      switch (mode) {
        case 'track':
          await TrackPlayer.setRepeatMode(1); // RepeatMode.Track
          break;
        case 'queue':
          await TrackPlayer.setRepeatMode(2); // RepeatMode.Queue
          break;
        default:
          await TrackPlayer.setRepeatMode(0); // RepeatMode.Off
      }
    } catch (error) {
      console.error('Error setting repeat mode:', error);
      throw error;
    }
  }

  // Make sure seekTo is properly implemented
  async seekTo(position: number): Promise<void> {
    try {
      await TrackPlayer.seekTo(position);
    } catch (error) {
      console.error('Error seeking to position:', error);
      throw error;
    }
  }
}

// Type for the hook return value
type PlayerStateHook = {
  isPlaying: boolean;
  currentTrack: Track | null;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentTrack: React.Dispatch<React.SetStateAction<Track | null>>;
};

// Custom hook for handling player state
const usePlayerState = (): PlayerStateHook => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  useTrackPlayerEvents(
    [Event.PlaybackState, Event.PlaybackTrackChanged],
    async event => {
      if (event.type === Event.PlaybackState) {
        const state = await TrackPlayer.getState();
        setIsPlaying(state === State.Playing);
      } else if (
        event.type === Event.PlaybackTrackChanged &&
        event.nextTrack !== undefined
      ) {
        const trackObject = await TrackPlayer.getTrack(event.nextTrack);
        setCurrentTrack(trackObject as Track);
      }
    },
  );

  return {isPlaying, currentTrack, setIsPlaying, setCurrentTrack};
};

// Create and export the service instance
const musicPlayerService = MusicPlayerService.getInstance();

// Export everything needed
export {musicPlayerService, usePlayerState, type PlayerStateHook};
