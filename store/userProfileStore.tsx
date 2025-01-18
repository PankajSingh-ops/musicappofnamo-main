// src/store/useProfileStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ImageAsset, Profile } from '../type';

interface ProfileState {
  profile: Profile;
  isLoading: boolean;
  isEditing: boolean;
  showDatePicker: boolean;
  error: string | null;

  setProfile: (profile: Profile) => void;
  updateField: <K extends keyof Profile>(field: K, value: Profile[K]) => void;
  setIsEditing: (value: boolean) => void;
  setShowDatePicker: (value: boolean) => void;
  
  fetchProfile: (token: string) => Promise<void>;
  updateProfile: (token: string) => Promise<void>;
  uploadProfileImage: (token: string, imageAsset: ImageAsset) => Promise<void>;
}

const API_URL = 'http://10.0.2.2:3000/api';

const useProfileStore = create<ProfileState>()(
  devtools((set, get) => ({
    profile: {
      full_name: '',
      email: '',
      bio: '',
      phone_number: '',
      country: '',
      gender: '',
      date_of_birth: '',
      image_url: '',
      followers: 0,
      following: 0,
    },
    isLoading: false,
    isEditing: false,
    showDatePicker: false,
    error: null,

    setProfile: (profile) => set({ profile }),
    updateField: (field, value) => 
      set((state) => ({
        profile: { ...state.profile, [field]: value }
      })),
    setIsEditing: (value) => set({ isEditing: value }),
    setShowDatePicker: (value) => set({ showDatePicker: value }),

    fetchProfile: async (token: string) => {
      try {
        set({ isLoading: true, error: null });
        const response = await fetch(`${API_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        set({ profile: data });
      } catch (error) {
        set({ error: 'Failed to fetch profile' });
        console.error('Error fetching profile:', error);
      } finally {
        set({ isLoading: false });
      }
    },

    updateProfile: async (token: string) => {
      try {
        set({ isLoading: true, error: null });
        const response = await fetch(`${API_URL}/user/profile`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(get().profile),
        });
        const data = await response.json();
        set({ profile: data, isEditing: false });
      } catch (error) {
        set({ error: 'Failed to update profile' });
        console.error('Error updating profile:', error);
      } finally {
        set({ isLoading: false });
      }
    },

    uploadProfileImage: async (token: string, imageAsset: ImageAsset) => {
      try {
        set({ isLoading: true, error: null });
        const formData = new FormData();
        formData.append('file', {
          uri: imageAsset.uri,
          type: imageAsset.type,
          name: imageAsset.fileName || 'image.jpg',
        });

        const response = await fetch(
          `${API_URL}/user/profile/upload/image`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          },
        );

        const data = await response.json();
        set((state) => ({
          profile: { ...state.profile, image_url: data.url }
        }));
      } catch (error) {
        set({ error: 'Failed to upload image' });
        console.error('Error uploading image:', error);
      } finally {
        set({ isLoading: false });
      }
    },
  })),
);

export default useProfileStore;