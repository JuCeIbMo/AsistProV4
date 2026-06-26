import { getApiUrl, API_CONFIG } from '../config/api';
import { fetchWithTimeout } from './httpClient';

type ApiResult = { ok: boolean; error?: string; code?: string };

async function postForm(endpoint: string, form?: FormData): Promise<ApiResult> {
  try {
    const res = await fetchWithTimeout(getApiUrl(endpoint), {
      method: 'POST',
      body: form,
      credentials: 'include',
    });
    const payload = await res.json().catch(() => null) as ApiResult | null;

    if (!res.ok) {
      return {
        ok: false,
        code: payload?.code,
        error: payload?.error || 'No se pudo completar la solicitud.',
      };
    }
    return payload || { ok: true };
  } catch {
    return { ok: false, error: 'Error de conexión.' };
  }
}

export async function requestOtp(phone: string): Promise<ApiResult> {
  const form = new FormData();
  form.append('phone', phone);
  return postForm(API_CONFIG.ENDPOINTS.OTP_REQUEST, form);
}

export async function verifyOtp(
  phone: string,
  code: string,
): Promise<ApiResult> {
  const form = new FormData();
  form.append('phone', phone);
  form.append('code', code);
  return postForm(API_CONFIG.ENDPOINTS.OTP_VERIFY, form);
}

export async function resendOtp(phone: string): Promise<ApiResult> {
  const form = new FormData();
  form.append('phone', phone);
  return postForm(API_CONFIG.ENDPOINTS.OTP_REQUEST, form);
}

export interface AuthUser {
  phone: string;
  currency: string;
  timezone: string;
}

export async function checkAuth(): Promise<{ ok: boolean; user?: AuthUser; error?: string }> {
  try {
    const res = await fetchWithTimeout(getApiUrl(API_CONFIG.ENDPOINTS.AUTH_ME), {
      method: 'GET',
      credentials: 'include',
    });
    const payload = await res.json().catch(() => null) as { ok: boolean; user?: AuthUser; error?: string } | null;

    if (!res.ok || !payload?.ok) {
      return { ok: false, error: payload?.error || 'No autenticado.' };
    }
    return { ok: true, user: payload.user };
  } catch {
    return { ok: false, error: 'Error de conexión.' };
  }
}

export async function logout(): Promise<void> {
  await postForm(API_CONFIG.ENDPOINTS.LOGOUT).catch(() => undefined);
}
