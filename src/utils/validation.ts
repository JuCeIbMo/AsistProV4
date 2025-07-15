// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneE164 = (phone: string): boolean => {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

export const formatPhoneE164 = (countryCode: string, phoneNumber: string): string => {
  // Remove any spaces, dashes, or other characters
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  return `${countryCode}${cleanPhone}`;
};

export const mapPlanName = (planName: string): string => {
  return planName.toLowerCase();
};