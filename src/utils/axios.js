import axios from 'axios';

const authRequest = () => {
  // const baseURL = process.env.REACT_APP_PYTHONANYWHERE_API;
  const baseURL = 'http://localhost:8000/api/v1';
  if (!baseURL) {
    throw new Error('Missing REACT_APP_PYTHONANYWHERE_API environment variable');
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
