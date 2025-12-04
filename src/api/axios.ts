import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 errors globally
api.interceptors.response.use(
  (response) => {
    // If response is successful, just return it
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Get current path to avoid infinite loops
      const currentPath = window.location.pathname;
      
      // Only handle if we're not already on the login page
      if (currentPath !== '/') {
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Show message
        toast.error('Your session has expired. Please login again.');
        
        // Redirect to login after a brief delay
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
    }
    
    // Handle other error codes
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    }
    
    if (error.response?.status === 404) {
      toast.error('The requested resource was not found.');
    }
    
    if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;