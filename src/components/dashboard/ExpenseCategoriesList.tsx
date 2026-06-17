import { PieChart } from 'lucide-react';
import type { ExpenseCategoryItem } from '../../services/dashboardService';
import { fmt } from './format';
import { Skeleton } from '../ui';

interface Props {
  categories: ExpenseCategoryItem[];
  loading: boolean;
  currency?: string;
}

export function ExpenseCategoriesList({ categories, loading, currency }: Props) {
  return (
    <div className="section-frame bg-dark-card/92 border border-dark-border rounded-[1.75rem] p-5 overflow-hidden">
      <h2 className="text-[11px] font-semibold text-dark-secondary uppercase tracking-[0.22em] mb-4">
        Categorías de gasto
      </h2>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(n => (
            <div key={n}>
              <div className="flex justify-between mb-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3.5 w-16" />
              </div>
              <Skeleton className="h-1.5 w-full" />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <PieChart className="w-8 h-8 text-dark-muted mb-2" aria-hidden="true" />
          <p className="text-sm text-dark-secondary">Sin gastos este mes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.slice(0, 6).map((c, idx) => (
            <div key={(c.slug || c.display_name) + idx}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-dark-text truncate pr-2">{c.display_name}</span>
                <span className="text-dark-secondary tabular-nums whitespace-nowrap">
                  {fmt(c.amount)} {currency && <span className="text-dark-muted">{currency}</span>}{' '}
                  <span className="text-dark-muted">· {c.share.toFixed(0)}%</span>
                </span>
              </div>
              <div className="h-1.5 bg-dark-border-subtle rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-dark-accent to-[#d7c7a4] transition-all duration-700"
                  style={{ width: `${Math.min(c.share, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
