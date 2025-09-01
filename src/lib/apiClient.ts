// D:/expense/client/src/lib/apiClient.ts

import axios from 'axios';
import { getCookie } from './utils'; // Import the new helper

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // We remove withCredentials because we are handling auth manually via headers
});

// --- THIS IS THE FIX ---
// Add a request interceptor to attach the token to every client-side request
apiClient.interceptors.request.use(
  (config) => {
    // This code runs before each request is sent
    if (typeof window !== 'undefined') {
      const token = getCookie('jwt');
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
