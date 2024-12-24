import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ProfileUpdateData {
  bio?: string;
  phoneNumber?: string;
  country?: string;
  gender?: string;
  dateOfBirth?: string;
  imageUrl?: string | null;
}

class UserProfileService {
  private async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem('token');
  }

  async fetchProfile() {
    try {
      const token = await this.getAuthToken();
      const response = await axios.get(
        'http://10.0.2.2:3000/api/user/profile',
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      console.log(response.data, 'respons data');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(data: ProfileUpdateData) {
    try {
      const token = await this.getAuthToken();
      const response = await axios.put(
        'http://10.0.2.2:3000/api/user/profile',
        data,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return new Error('Unauthorized. Please login again.');
      }
      return new Error(error.response?.data?.error || 'Network error occurred');
    }
    return new Error('An unexpected error occurred');
  }
}

export const profileService = new UserProfileService();
