import {create} from 'zustand';

interface TrackState {
  hoveredTrackId: string | null;
  selectedTrackId: string | null;
  isEditMode: boolean;
  // Actions
  setHoveredTrack: (trackId: string | null) => void;
  setSelectedTrack: (trackId: string | null) => void;
  setEditMode: (isEditing: boolean) => void;
}

export const useTrackStore = create<TrackState>((set) => ({
  hoveredTrackId: null,
  selectedTrackId: null,
  isEditMode: false,

  setHoveredTrack: (trackId) => set({ hoveredTrackId: trackId }),
  setSelectedTrack: (trackId) => set({ selectedTrackId: trackId }),
  setEditMode: (isEditing) => set({ isEditMode: isEditing }),
}));