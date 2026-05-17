import { getApiUrl, API_CONFIG } from '../config/api';

const TOKEN_KEY = 'asistpro_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export async function requestOtp(phone: string): Promise<{ ok: boolean; error?: string }> {
  const form = new FormData();
  form.append('phone', phone);
  const res = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.OTP_REQUEST), {
    method: 'POST',
    body: form,
  });
  return res.json();
}

export async function verifyOtp(
  phone: string,
  code: string,
): Promise<{ ok: boolean; token?: string; error?: string }> {
  const form = new FormData();
  form.append('phone', phone);
  form.append('code', code);
  const res = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.OTP_VERIFY), {
    method: 'POST',
    body: form,
  });
  return res.json();
}

export function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
