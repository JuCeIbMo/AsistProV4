import { getApiUrl, API_CONFIG } from '../config/api';
import { authHeaders } from './authService';

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

export interface DashboardSummary {
  currency: string;
  total_balance: string;
  month_label: string;
  accounts: AccountBalance[];
  month: MonthSummary;
  budgets: BudgetItem[];
  recent_transactions: Transaction[];
}

export async function fetchSummary(): Promise<DashboardSummary | null> {
  const res = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SUMMARY), {
    headers: authHeaders(),
  });
  if (!res.ok) return null;
  return res.json();
}
