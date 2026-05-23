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
    <div className="bg-dark-card border border-dark-border rounded-2xl p-5 overflow-hidden">
      <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-4">
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
          <PieChart className="w-8 h-8 text-gray-700 mb-2" aria-hidden="true" />
          <p className="text-sm text-gray-600">Sin gastos este mes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.slice(0, 6).map((c, idx) => (
            <div key={(c.slug || c.display_name) + idx}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-gray-300 truncate pr-2">{c.display_name}</span>
                <span className="text-gray-500 tabular-nums whitespace-nowrap">
                  {fmt(c.amount)} {currency && <span className="text-gray-700">{currency}</span>}{' '}
                  <span className="text-gray-600">· {c.share.toFixed(0)}%</span>
                </span>
              </div>
              <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-700"
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
