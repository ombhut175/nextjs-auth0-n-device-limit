import axios, { type AxiosResponse, type AxiosError } from 'axios';
import { toast } from 'sonner';

/**
 * Simple API client for making requests to Next.js API routes
 */
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/**
 * Generic API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Toast options for API requests
 */
export interface ToastOptions {
  showSuccess?: boolean;
  showError?: boolean;
  successMessage?: string;
  successDescription?: string;
  errorMessage?: string;
  errorDescription?: string;
}

/**
 * Generic request wrapper with error handling and optional toast notifications
 */
async function request<T>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  data?: unknown,
  toastOptions?: ToastOptions
): Promise<T> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.request({
      method,
      url,
      data,
    });

    if (response.data.success) {
      // Show success toast if enabled
      if (toastOptions?.showSuccess) {
        toast.success(
          toastOptions.successMessage || 'Success',
          toastOptions.successDescription ? {
            description: toastOptions.successDescription
          } : undefined
        );
      }
      
      // Return data if present, otherwise return empty object as T
      return (response.data.data !== undefined ? response.data.data : {}) as T;
    }

    throw new Error(response.data.error || response.data.message || 'Request failed');
  } catch (error) {
    let errorMessage = 'An error occurred';
    
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse>;
      errorMessage = axiosError.response?.data?.error || 
                     axiosError.response?.data?.message || 
                     axiosError.message || 
                     'An error occurred';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Show error toast if enabled
    if (toastOptions?.showError) {
      toast.error(
        toastOptions.errorMessage || 'Request failed',
        {
          description: toastOptions.errorDescription || errorMessage
        }
      );
    }

    throw new Error(errorMessage);
  }
}

/**
 * API request methods
 */
export const apiRequest = {
  get: <T>(url: string, toastOptions?: ToastOptions) => 
    request<T>('get', url, undefined, toastOptions),
  post: <T>(url: string, data?: unknown, toastOptions?: ToastOptions) => 
    request<T>('post', url, data, toastOptions),
  put: <T>(url: string, data?: unknown, toastOptions?: ToastOptions) => 
    request<T>('put', url, data, toastOptions),
  patch: <T>(url: string, data?: unknown, toastOptions?: ToastOptions) => 
    request<T>('patch', url, data, toastOptions),
  delete: <T>(url: string, toastOptions?: ToastOptions) => 
    request<T>('delete', url, undefined, toastOptions),
};

/**
 * Fetcher for SWR with automatic error handling
 * Extracts data from ApiResponse structure
 */
export const swrFetcher = <T>(url: string): Promise<T> => 
  apiClient.get<ApiResponse<T>>(url).then(res => {
    if (res.data.success) {
      return (res.data.data !== undefined ? res.data.data : {}) as T;
    }
    throw new Error(res.data.error || res.data.message || 'Request failed');
  });

export { apiClient };
