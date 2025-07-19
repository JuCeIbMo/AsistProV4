// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://8565ac5210f8.ngrok-free.app',
     
  ENDPOINTS: {
    CREATE_SUBSCRIPTION: '/api/subscriptions/create'
  },
  TIMEOUT: 15000 // 15 seconds
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => `${API_CONFIG.BASE_URL}${endpoint}`;