import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import SuccessModal from './SuccessModal';
import styles from './SupportFormCss';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  imageUrl?: string;
}

const API_BASE_URL = 'http://10.0.2.2:3000'; // Replace with your actual API base URL

const SupportForm = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleImagePick = async () => {
    const options = {
      mediaType: 'photo' as const,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    try {
      const response = await ImagePicker.launchImageLibrary(options);
      
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to pick image');
      } else if (response.assets && response.assets[0].uri) {
        setSelectedImage(response.assets[0].uri);
        
        // Upload image to R2
        const formData = new FormData();
        formData.append('file', {
          uri: response.assets[0].uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName || 'image.jpg',
        });

        setIsLoading(true);
        try {
          const uploadResponse = await axios.post(
            `${API_BASE_URL}/api/support/upload/image`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          setFormData(prev => ({
            ...prev,
            imageUrl: uploadResponse.data.url,
          }));
        } catch (error) {
          console.error('Error uploading image:', error);
          Alert.alert('Error', 'Failed to upload image');
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await axios.post(`${API_BASE_URL}/api/support`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200 || response.status === 201) {
          setShowSuccessModal(true);
          setTimeout(() => {
            setShowSuccessModal(false);
            setFormData({
              name: '',
              email: '',
              subject: '',
              message: '',
            });
            setSelectedImage(null);
          }, 2000);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        Alert.alert(
          'Error',
          error.response?.data?.message || 'An error occurred while submitting the form'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Image
          source={require('../../../assests/logo/logo.png')}
          style={{
            width: 200,
            height: 200,
            margin: 'auto',
          }}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.title}>Support Form</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={text => setFormData({...formData, name: text})}
          placeholder="Enter your name"
          placeholderTextColor="white"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={text => setFormData({...formData, email: text})}
          placeholder="Enter your email"
          placeholderTextColor="white"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Subject *</Text>
        <TextInput
          style={styles.input}
          value={formData.subject}
          onChangeText={text => setFormData({...formData, subject: text})}
          placeholder="Enter subject"
          placeholderTextColor="white"
        />
        {errors.subject && <Text style={styles.errorText}>{errors.subject}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, styles.messageInput]}
          value={formData.message}
          onChangeText={text => setFormData({...formData, message: text})}
          placeholder="Enter your message"
          placeholderTextColor="white"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Drop an image of what is the problem</Text>
        <TouchableOpacity 
          style={styles.imageButton} 
          onPress={handleImagePick}
          disabled={isLoading}
        >
          <Text style={styles.imageButtonText}>
            {isLoading ? 'Uploading...' : 'Choose Image'}
          </Text>
        </TouchableOpacity>
        {selectedImage && (
          <View style={{position: 'relative', width: '100%'}}>
            <Image source={{uri: selectedImage}} style={styles.previewImage} />
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 15,
                right: 15,
                backgroundColor: 'rgba(0,0,0,0.5)',
                width: 25,
                height: 25,
                borderRadius: 12.5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                setSelectedImage(null);
                setFormData(prev => ({ ...prev, imageUrl: undefined }));
              }}>
              <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
          disabled={isLoading}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </ScrollView>
  );
};

export default SupportForm;