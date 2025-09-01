// D:/expense/client/src/lib/apiClient.ts

import axios from 'axios';
import { getCookie } from './utils'; // Import the new helper

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // withCredentials: true, // We no longer need this
});

// --- THIS IS THE FIX ---
// Add a request interceptor to attach the token to every client-side request
apiClient.interceptors.request.use(
  (config) => {
    // This code will run before each request is sent
    const token = getCookie('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);
// --- END FIX ---

export default apiClient;
