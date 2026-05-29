import { getApiUrl, API_CONFIG } from '../config/api';
import { logout } from './authService';

export interface AccountBalance {
  id: string;
  name: string;
  currency: string;
  balance: string;
  is_default: boolean;
}

export interface MonthSummary {
  income: string;
  expense: string;
  net: string;
  savings_rate: number;
}

export interface BudgetItem {
  id: string;
  category: { display_name: string };
  period: string;
  spent_amount: string;
  limit_amount: string;
  percentage_used: string;
  threshold: 'ok' | 'warning' | 'over_limit';
}

export interface Transaction {
  id: string;
  direction: 'income' | 'expense' | 'transfer';
  amount: string;
  currency: string;
  description: string;
  category: string | null;
  occurred_at: string;
}

export interface ExpenseCategoryItem {
  slug: string | null;
  display_name: string;
  amount: string;
  share: number;
}

export interface MonthlyTrendPoint {
  label: string;
  year: number;
  month: number;
  income: string;
  expense: string;
  net: string;
}

export interface DashboardSummary {
  currency: string;
  total_balance: string;
  month_label: string;
  accounts: AccountBalance[];
  month: MonthSummary;
  budgets: BudgetItem[];
  expense_categories: ExpenseCategoryItem[];
  monthly_trend: MonthlyTrendPoint[];
  recent_transactions: Transaction[];
}

export interface TransactionsPage {
  items: Transaction[];
  next_cursor: string | null;
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'missed';

export interface AppointmentCategory {
  id: string;
  kind: string;
  slug: string;
  display_name: string;
  is_active: boolean;
  sort_order: number;
}

export interface Appointment {
  id: string;
  title: string;
  description: string | null;
  category: AppointmentCategory | null;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  with_person: string | null;
  status: AppointmentStatus;
  reminder_minutes: number | null;
  raw_input: string | null;
}

export type FetchResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: 'unauthorized' | 'error' };

async function apiGet<T>(endpoint: string, params?: Record<string, string | null>): Promise<FetchResult<T>> {
  const base = typeof window === 'undefined' ? 'http://localhost' : window.location.origin;
  const url = new URL(getApiUrl(endpoint), base);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== null && v !== undefined && v !== '') url.searchParams.set(k, v);
    }
  }
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const res = await fetch(url.toString(), {
      credentials: 'include',
      signal: controller.signal,
    });
    if (res.status === 401 || res.status === 403) {
      await logout();
      return { ok: false, status: 'unauthorized' };
    }
    if (!res.ok) return { ok: false, status: 'error' };
    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch {
    return { ok: false, status: 'error' };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function apiPatch<T>(endpoint: string, body: unknown): Promise<FetchResult<T>> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const res = await fetch(getApiUrl(endpoint), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
      signal: controller.signal,
    });
    if (res.status === 401 || res.status === 403) {
      await logout();
      return { ok: false, status: 'unauthorized' };
    }
    if (!res.ok) return { ok: false, status: 'error' };
    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch {
    return { ok: false, status: 'error' };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function fetchSummary(): Promise<FetchResult<DashboardSummary>> {
  return apiGet<DashboardSummary>(API_CONFIG.ENDPOINTS.SUMMARY);
}

export function fetchTransactionsPage(
  cursor: string | null,
  direction: 'income' | 'expense' | null,
  limit = 25,
  startDate?: string,
  endDate?: string,
): Promise<FetchResult<TransactionsPage>> {
  return apiGet<TransactionsPage>(API_CONFIG.ENDPOINTS.TRANSACTIONS, {
    cursor,
    direction,
    limit: String(limit),
    start_date: startDate || null,
    end_date: endDate || null,
  });
}

export function fetchTransactionDetail(id: string): Promise<FetchResult<Transaction>> {
  return apiGet<Transaction>(`${API_CONFIG.ENDPOINTS.TRANSACTIONS}/${id}`);
}

export function fetchAppointments(filters: {
  status?: AppointmentStatus | null;
  startDate?: string;
  endDate?: string;
}): Promise<FetchResult<{ appointments: Appointment[] }>> {
  return apiGet<{ appointments: Appointment[] }>(API_CONFIG.ENDPOINTS.APPOINTMENTS, {
    status: filters.status || null,
    start_date: filters.startDate || null,
    end_date: filters.endDate || null,
  });
}

export function fetchAppointmentDetail(
  id: string,
): Promise<FetchResult<{ appointment: Appointment }>> {
  return apiGet<{ appointment: Appointment }>(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${id}`);
}

export function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<FetchResult<{ appointment: Appointment }>> {
  return apiPatch<{ appointment: Appointment }>(
    `${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${id}`,
    { status },
  );
}
