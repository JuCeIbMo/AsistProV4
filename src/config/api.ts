// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://8565ac5210f8.ngrok-free.app',

  ENDPOINTS: {
    // Existing
    CREATE_SUBSCRIPTION: '/api/subscriptions/create',
    // Auth
    OTP_REQUEST: '/auth/otp/request',
    OTP_VERIFY:  '/auth/otp/verify',
    // Dashboard
    SUMMARY: '/api/web/summary',
    TRANSACTIONS: '/api/web/transactions',
  },
  TIMEOUT: 15000,
};

export const getApiUrl = (endpoint: string) => `${API_CONFIG.BASE_URL}${endpoint}`;
