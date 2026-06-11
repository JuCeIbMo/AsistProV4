// API Configuration
export const API_CONFIG = {
  BASE_URL: '/backend',

  ENDPOINTS: {
    // Auth
    OTP_REQUEST: '/auth/otp/request',
    OTP_VERIFY:  '/auth/otp/verify',
    LOGOUT: '/auth/logout',
    AUTH_ME: '/auth/me',
    // Dashboard
    SUMMARY: '/api/web/summary',
    TRANSACTIONS: '/api/web/transactions',
    TRANSACTION_DETAIL: '/api/web/transactions',
    APPOINTMENTS: '/api/web/appointments',
    SETTINGS: '/api/web/settings',
  },
  TIMEOUT: 15000,
};

export const getApiUrl = (endpoint: string) => {
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${path}`;
};
