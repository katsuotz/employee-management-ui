import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// API Client helper functions
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    // Return response directly for cleaner API
    return response?.data;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      throw new ApiError(
        data?.message || `HTTP error! status: ${status}`,
        status,
        data
      );
    } else if (error.request) {
      // Request was made but no response received
      throw new ApiError(
        'Network error. Please check your connection and try again.',
        0,
        error
      );
    } else {
      // Something else happened
      throw new ApiError(
        error.message || 'An unexpected error occurred',
        0,
        error
      );
    }
  }
);

// API methods using axios
export const api = {
  get: <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get<T>(endpoint, config).then(response => response.data),
    
  post: <T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.post<T>(endpoint, data, config).then(response => response.data),
    
  put: <T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.put<T>(endpoint, data, config).then(response => response.data),
    
  patch: <T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.patch<T>(endpoint, data, config).then(response => response.data),
    
  delete: <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete<T>(endpoint, config).then(response => response.data),
};

export default api;
