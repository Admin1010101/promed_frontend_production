import axios from 'axios';
import { API_BASE_URL } from './constants';

const authRequest = () => {
  // Use the constant from your constants file instead of env variable
  // This avoids the quote issue you were experiencing
  const baseURL = API_BASE_URL;
  
  if (!baseURL) {
    throw new Error('Missing API base URL');
  }

  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 401 && !originalRequest.__isRetryRequest) {
        originalRequest.__isRetryRequest = true;
        
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) throw new Error('No refresh token available');

          const refreshResponse = await axios.post(`${baseURL}/provider/token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccessToken = refreshResponse.data.access;
          localStorage.setItem('accessToken', newAccessToken);

          // Retry original request with updated token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

export default authRequest;