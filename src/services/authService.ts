import { getApiUrl, API_CONFIG } from '../config/api';

export async function requestOtp(phone: string): Promise<{ ok: boolean; error?: string }> {
  const form = new FormData();
  form.append('phone', phone);
  const res = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.OTP_REQUEST), {
    method: 'POST',
    body: form,
    credentials: 'include',
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
    credentials: 'include',
  });
  return res.json();
}

export async function logout(): Promise<void> {
  await fetch(getApiUrl(API_CONFIG.ENDPOINTS.LOGOUT), {
    method: 'POST',
    credentials: 'include',
  }).catch(() => undefined);
}
