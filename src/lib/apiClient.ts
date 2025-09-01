// D:/expense/client/src/lib/apiClient.ts

import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// --- THIS IS THE FIX ---
// The interceptor now reads the token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    // Check if running in the browser before accessing localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwt');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// --- END FIX ---

export default apiClient;
