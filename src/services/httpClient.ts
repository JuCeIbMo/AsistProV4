import { API_CONFIG, getApiUrl } from '../config/api';

export function toSearchParams(
  params?: Record<string, string | null | undefined>,
): Record<string, string> {
  if (!params) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== null && value !== undefined && value !== ''),
  ) as Record<string, string>;
}

export function buildApiUrl(
  endpoint: string,
  params?: Record<string, string | null | undefined>,
): string {
  const base = typeof window === 'undefined' ? 'http://localhost' : window.location.origin;
  const url = new URL(getApiUrl(endpoint), base);

  for (const [key, value] of Object.entries(toSearchParams(params))) {
    url.searchParams.set(key, value);
  }

  return url.toString();
}

export function isUnauthorizedStatus(status: number): boolean {
  return status === 401 || status === 403;
}

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}
