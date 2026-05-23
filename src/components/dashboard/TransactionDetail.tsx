import { useEffect } from 'react';
import { X, ArrowUpRight, ArrowDownLeft, ArrowLeftRight } from 'lucide-react';
import type { Transaction } from '../../services/dashboardService';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useClickOutside } from '../../hooks/useClickOutside';
import { Badge } from '../ui';
import { darkColors, shadows, zIndex } from '../../styles/tokens';
import { fmt } from './format';

interface TransactionDetailProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionDetail({ transaction, isOpen, onClose }: TransactionDetailProps) {
  const panelRef = useFocusTrap<HTMLDivElement>({ active: isOpen });

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Close on click outside
  useClickOutside(panelRef, () => {
    if (isOpen) {
      onClose();
    }
  });

  if (!isOpen || !transaction) return null;

  const isIncome = transaction.direction === 'income';
  const isExpense = transaction.direction === 'expense';
  const Icon = isIncome ? ArrowUpRight : isExpense ? ArrowDownLeft : ArrowLeftRight;
  const iconBg = isIncome ? 'bg-emerald-500/10' : isExpense ? 'bg-red-500/10' : 'bg-blue-500/10';
  const iconCol = isIncome ? 'text-emerald-400' : isExpense ? 'text-red-400' : 'text-blue-400';
  const amtCol = isIncome ? 'text-emerald-400' : isExpense ? 'text-red-400' : 'text-gray-400';
  const prefix = isIncome ? '+' : isExpense ? '-' : '';

  const formattedDate = new Date(transaction.occurred_at).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      className="fixed inset-0"
      style={{ zIndex: parseInt(zIndex.modal) }}
      data-theme="dark"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.70)' }}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className="absolute right-0 top-0 h-full w-full sm:max-w-md outline-none overflow-y-auto"
        style={{
          backgroundColor: darkColors.card,
          boxShadow: shadows['2xl'],
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: darkColors.border }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ color: darkColors['text-primary'] }}
          >
            Detalle del movimiento
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: darkColors.secondary }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = darkColors.elevated;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
            }}
            aria-label="Cerrar panel"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Direction icon + amount */}
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}
            >
              <Icon className={`w-6 h-6 ${iconCol}`} aria-hidden="true" />
            </div>
            <div>
              <p className={`text-2xl font-bold tabular-nums ${amtCol}`}>
                {prefix}{fmt(transaction.amount)}
              </p>
              <p className="text-sm" style={{ color: darkColors.secondary }}>
                {transaction.currency}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p
              className="text-xs font-medium uppercase tracking-wider mb-1"
              style={{ color: darkColors.muted }}
            >
              Descripción
            </p>
            <p
              className="text-base font-medium"
              style={{ color: darkColors['text-primary'] }}
            >
              {transaction.description || 'Sin descripción'}
            </p>
          </div>

          {/* Category */}
          {transaction.category && (
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: darkColors.muted }}
              >
                Categoría
              </p>
              <Badge variant="accent" size="md">
                {transaction.category}
              </Badge>
            </div>
          )}

          {/* Date */}
          <div>
            <p
              className="text-xs font-medium uppercase tracking-wider mb-1"
              style={{ color: darkColors.muted }}
            >
              Fecha
            </p>
            <p className="text-sm" style={{ color: darkColors.text }}>
              {formattedDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
