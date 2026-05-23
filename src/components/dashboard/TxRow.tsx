import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight } from 'lucide-react';
import type { Transaction } from '../../services/dashboardService';
import { fmt } from './format';

interface TxRowProps {
  tx: Transaction;
  onClick?: (tx: Transaction) => void;
}

export function TxRow({ tx, onClick }: TxRowProps) {
  const isIncome = tx.direction === 'income';
  const isExpense = tx.direction === 'expense';
  const Icon = isIncome ? ArrowUpRight : isExpense ? ArrowDownLeft : ArrowLeftRight;
  const iconBg = isIncome ? 'bg-emerald-500/10' : isExpense ? 'bg-red-500/10' : 'bg-blue-500/10';
  const iconCol = isIncome ? 'text-emerald-400' : isExpense ? 'text-red-400' : 'text-blue-400';
  const amtCol = isIncome ? 'text-emerald-400' : isExpense ? 'text-red-400' : 'text-gray-400';
  const prefix = isIncome ? '+' : isExpense ? '-' : '';
  const label = tx.description || tx.category || (isIncome ? 'Ingreso' : isExpense ? 'Gasto' : 'Transferencia');

  const formattedDate = new Date(tx.occurred_at).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick(tx);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(tx);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-white/[0.03] transition-colors min-h-[44px]"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconCol}`} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-dark-text truncate">{label}</p>
          <p className="text-xs text-dark-muted truncate">
            {tx.category && tx.description ? `${tx.category} · ` : ''}{formattedDate}
          </p>
        </div>
      </div>
      <p className={`text-sm font-semibold ml-4 flex-shrink-0 tabular-nums ${amtCol}`}>
        {prefix}{fmt(tx.amount)}
      </p>
    </div>
  );
}
