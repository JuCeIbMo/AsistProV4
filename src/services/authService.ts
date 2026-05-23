import { getApiUrl, API_CONFIG } from '../config/api';

type ApiResult = { ok: boolean; error?: string };

async function postForm(endpoint: string, form?: FormData): Promise<ApiResult> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const res = await fetch(getApiUrl(endpoint), {
      method: 'POST',
      body: form,
      credentials: 'include',
      signal: controller.signal,
    });
    const payload = await res.json().catch(() => null) as ApiResult | null;

    if (!res.ok) {
      return {
        ok: false,
        error: payload?.error || 'No se pudo completar la solicitud.',
      };
    }
    return payload || { ok: true };
  } catch {
    return { ok: false, error: 'Error de conexión.' };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function requestOtp(phone: string): Promise<{ ok: boolean; error?: string }> {
  const form = new FormData();
  form.append('phone', phone);
  return postForm(API_CONFIG.ENDPOINTS.OTP_REQUEST, form);
}

export async function verifyOtp(
  phone: string,
  code: string,
): Promise<{ ok: boolean; error?: string }> {
  const form = new FormData();
  form.append('phone', phone);
  form.append('code', code);
  return postForm(API_CONFIG.ENDPOINTS.OTP_VERIFY, form);
}

export async function resendOtp(phone: string): Promise<{ ok: boolean; error?: string }> {
  const form = new FormData();
  form.append('phone', phone);
  return postForm(API_CONFIG.ENDPOINTS.OTP_REQUEST, form);
}

export async function logout(): Promise<void> {
  await postForm(API_CONFIG.ENDPOINTS.LOGOUT).catch(() => undefined);
}
