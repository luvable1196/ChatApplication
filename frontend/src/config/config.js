// API Configuration
// Replace this URL with your actual backend URL
export const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Authentication endpoints
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  logout: `${API_BASE_URL}/auth/logout`,
  checkAuth: `${API_BASE_URL}/auth/me`,
  
  // Chat endpoints
  chat: `${API_BASE_URL}/chat`,
  messages: `${API_BASE_URL}/messages`,
};

// Default headers for all requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Request configuration
export const REQUEST_CONFIG = {
  credentials: 'include', // Include cookies for session management
  headers: DEFAULT_HEADERS,
};