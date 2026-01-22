import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Real backend API URL
const BASE_URL = 'http://172.21.30.116:8080/api';

// Create axios instance with real backend configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token from AsyncStorage
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading token from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Return response data directly for easier use
    return response;
  },
  async (error) => {
    // Handle 401 unauthorized - clear token and user data
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
      } catch (storageError) {
        console.error('Error clearing storage:', storageError);
      }
    }
    
    // Return error with user-friendly message
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Network error. Please check your connection.';
    
    return Promise.reject({
      ...error,
      userMessage: errorMessage,
    });
  }
);

export default apiClient;

