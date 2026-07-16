import { API_CONFIG } from '../config/api';
import { logout } from './authService';
import { buildApiUrl, fetchWithTimeout, isUnauthorizedStatus } from './httpClient';

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

export interface TodaySummary {
  income: string;
  expense: string;
  event_count: number;
}

export interface PendingItem {
  id: string;
  title: string;
  with_person: string | null;
  starts_at: string;
  status: AppointmentStatus;
  reminder_minutes: number | null;
  note_kind: 'up_next' | 'later_today';
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
  previous_amount: string | null;
  change_pct: number | null;
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
  today: TodaySummary;
  pending_items: PendingItem[];
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

type QueryParams = Record<string, string | null | undefined>;

async function handleJsonResponse<T>(response: Response): Promise<FetchResult<T>> {
  if (isUnauthorizedStatus(response.status)) {
    await logout();
    return { ok: false, status: 'unauthorized' };
  }

  if (!response.ok) {
    return { ok: false, status: 'error' };
  }

  const data = (await response.json()) as T;
  return { ok: true, data };
}

async function apiGet<T>(endpoint: string, params?: QueryParams): Promise<FetchResult<T>> {
  try {
    const response = await fetchWithTimeout(buildApiUrl(endpoint, params), {
      credentials: 'include',
    });
    return handleJsonResponse<T>(response);
  } catch {
    return { ok: false, status: 'error' };
  }
}

async function apiPatch<T>(endpoint: string, body: unknown): Promise<FetchResult<T>> {
  try {
    const response = await fetchWithTimeout(buildApiUrl(endpoint), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    return handleJsonResponse<T>(response);
  } catch {
    return { ok: false, status: 'error' };
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

export interface Category {
  id: string;
  kind: 'expense' | 'income' | 'appointment';
  slug: string;
  display_name: string;
  is_active: boolean;
  sort_order: number;
}

export interface CategoryUpdatePayload {
  display_name?: string;
  is_active?: boolean;
  sort_order?: number;
}

export function fetchCategories(): Promise<FetchResult<{ categories: Category[] }>> {
  return apiGet<{ categories: Category[] }>('/api/web/categories');
}

export function updateCategory(
  id: string,
  payload: CategoryUpdatePayload,
): Promise<FetchResult<{ category: Category }>> {
  return apiPatch<{ category: Category }>(`/api/web/categories/${id}`, payload);
}

export interface ProfileSettings {
  currency: string;
  timezone: string;
  locale: string | null;
}

// Sólo se envían los campos a cambiar. La moneda se infiere por región telefónica
// en el onboarding; esto permite corregirla desde el dashboard.
export function updateSettings(
  changes: { base_currency?: string; timezone?: string; locale?: string },
): Promise<FetchResult<ProfileSettings>> {
  return apiPatch<ProfileSettings>(API_CONFIG.ENDPOINTS.SETTINGS, changes);
}
