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
  try {
    const res = await fetch(url.toString(), { credentials: 'include' });
    if (res.status === 401 || res.status === 403) {
      await logout();
      return { ok: false, status: 'unauthorized' };
    }
    if (!res.ok) return { ok: false, status: 'error' };
    const data = (await res.json()) as T;
    return { ok: true, data };
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
): Promise<FetchResult<TransactionsPage>> {
  return apiGet<TransactionsPage>(API_CONFIG.ENDPOINTS.TRANSACTIONS, {
    cursor,
    direction,
    limit: String(limit),
  });
}
