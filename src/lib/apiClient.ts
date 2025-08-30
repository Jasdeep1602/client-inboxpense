import axios from 'axios';

/**
 * A pre-configured Axios instance for making authenticated API requests.
 *
 * It includes the following configurations:
 * - `baseURL`: Sets the base path for all API requests to the backend URL defined in environment variables.
 * - `withCredentials`: This is the crucial setting that ensures the browser sends the HttpOnly `jwt` cookie
 *   with every request to the backend, allowing the server to authenticate the user.
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export default apiClient;
