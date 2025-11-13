import axios from 'axios';
import hackLog from '@/helpers/logger';

/**
 * Simple API client for Next.js API routes
 * Configured to work with the authentication app's API structure
 */
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    hackLog.http.request(
      config.method?.toUpperCase() || 'GET',
      config.url || '',
      config.headers,
      config.data
    );
    return config;
  },
  (error) => {
    hackLog.console.error('Request error', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    hackLog.http.response(response.status, response.config.url || '');
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      hackLog.http.response(
        error.response?.status || 500,
        error.config?.url || '',
        error.response?.data
      );
    }
    return Promise.reject(error);
  }
);

export default apiClient;