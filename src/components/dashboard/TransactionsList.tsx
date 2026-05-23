import { useEffect, useState } from 'react';
import { Receipt } from 'lucide-react';
import { fetchTransactionsPage, type Transaction } from '../../services/dashboardService';
import { TxRow } from './TxRow';
import { TransactionDetail } from './TransactionDetail';
import { Skeleton } from '../ui';
import { darkColors } from '../../styles/tokens';

type DirFilter = 'all' | 'income' | 'expense';
type DatePreset = 'this-month' | 'last-3-months' | 'last-year';

interface Props {
  initialItems: Transaction[];
  loading: boolean;
  onUnauthorized: () => void;
}

function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getFirstDayOfMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

function getMonthsAgo(n: number): string {
  const now = new Date();
  now.setMonth(now.getMonth() - n);
  return formatDate(now);
}

function getYearsAgo(n: number): string {
  const now = new Date();
  now.setFullYear(now.getFullYear() - n);
  return formatDate(now);
}

export function TransactionsList({ initialItems, loading, onUnauthorized }: Props) {
  const [filter, setFilter] = useState<DirFilter>('all');
  const [items, setItems] = useState<Transaction[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0); // 0 = first page (initialItems / first fetch)
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState(false);

  // Date filter state
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [activePreset, setActivePreset] = useState<DatePreset | null>(null);

  // Detail panel state
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  function applyPreset(preset: DatePreset) {
    const today = formatDate(new Date());
    let start = '';
    switch (preset) {
      case 'this-month':
        start = getFirstDayOfMonth();
        break;
      case 'last-3-months':
        start = getMonthsAgo(3);
        break;
      case 'last-year':
        start = getYearsAgo(1);
        break;
    }
    setActivePreset(preset);
    setStartDate(start);
    setEndDate(today);
  }

  function clearDateFilter() {
    setActivePreset(null);
    setStartDate('');
    setEndDate('');
  }

  function openDetail(tx: Transaction) {
    setSelectedTx(tx);
    setDetailOpen(true);
  }

  function closeDetail() {
    setDetailOpen(false);
    setSelectedTx(null);
  }

  // Reload from cursor=null when filter or date range changes
  useEffect(() => {
    if (filter === 'all' && page === 0 && !startDate && !endDate) {
      setItems(initialItems);
      setCursor(null);
      setPageError(false);
      return;
    }
    let cancelled = false;
    async function loadFirst() {
      setPageLoading(true);
      setPageError(false);
      const dir = filter === 'all' ? null : filter;
      const result = await fetchTransactionsPage(
        null,
        dir,
        25,
        startDate || undefined,
        endDate || undefined
      );
      if (cancelled) return;
      if (!result.ok) {
        if (result.status === 'unauthorized') onUnauthorized();
        else setPageError(true);
        setPageLoading(false);
        return;
      }
      setItems(result.data.items);
      setCursor(result.data.next_cursor);
      setPageLoading(false);
    }
    setPage(1);
    loadFirst();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, startDate, endDate]);

  // Refresh initial items when prop changes (e.g. user clicked refresh)
  useEffect(() => {
    if (filter === 'all' && !startDate && !endDate) {
      setItems(initialItems);
      setCursor(null);
      setPage(0);
    }
  }, [initialItems, filter, startDate, endDate]);

  async function loadMore() {
    if (!cursor) return;
    setPageLoading(true);
    setPageError(false);
    const dir = filter === 'all' ? null : filter;
    const result = await fetchTransactionsPage(
      cursor,
      dir,
      25,
      startDate || undefined,
      endDate || undefined
    );
    if (!result.ok) {
      if (result.status === 'unauthorized') onUnauthorized();
      else setPageError(true);
      setPageLoading(false);
      return;
    }
    setItems(prev => [...prev, ...result.data.items]);
    setCursor(result.data.next_cursor);
    setPageLoading(false);
  }

  // For 'all' on page 0 we use cursor only after the user clicks "Cargar más" once;
  // we need to fetch the next page from the LAST item we already have. Easiest: do a
  // first paginated fetch when the user hits "Cargar más" for the first time.
  async function loadMoreFromAllInitial() {
    if (items.length === 0) return;
    // Build a cursor heuristic: we need backend cursor; since the initial recent_transactions
    // already came from `transactions_page(limit=10)` we just need to fetch more.
    // Simplest: re-fetch the first page of 25 to align, then continue. Skip dup by id.
    setPageLoading(true);
    setPageError(false);
    const dir = filter === 'all' ? null : filter;
    const result = await fetchTransactionsPage(
      null,
      dir,
      25,
      startDate || undefined,
      endDate || undefined
    );
    if (!result.ok) {
      if (result.status === 'unauthorized') onUnauthorized();
      else setPageError(true);
      setPageLoading(false);
      return;
    }
    const seen = new Set(items.map(t => t.id));
    const merged = [...items, ...result.data.items.filter(t => !seen.has(t.id))];
    setItems(merged);
    setCursor(result.data.next_cursor);
    setPage(1);
    setPageLoading(false);
  }

  const tabs: { id: DirFilter; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'income', label: 'Ingresos' },
    { id: 'expense', label: 'Egresos' },
  ];

  const dateFilterActive = !!(startDate || endDate);

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-dark-muted uppercase tracking-widest">
          Movimientos
        </h2>
<div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.05] rounded-lg p-0.5">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition min-h-[36px] ${
                  filter === t.id
                    ? 'bg-orange-500/15 text-orange-300'
                    : 'text-dark-secondary hover:text-dark-text'
                }`}
              >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date filter */}
      <div className="mb-3 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
<button
              onClick={() => applyPreset('this-month')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition min-h-[36px] ${
                activePreset === 'this-month'
                  ? 'bg-orange-500/15 text-orange-300'
                  : 'bg-dark-elevated text-dark-secondary hover:text-dark-text'
              }`}
            >
              Este mes
            </button>
            <button
              onClick={() => applyPreset('last-3-months')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition min-h-[36px] ${
                activePreset === 'last-3-months'
                  ? 'bg-orange-500/15 text-orange-300'
                  : 'bg-dark-elevated text-dark-secondary hover:text-dark-text'
              }`}
            >
              Últimos 3 meses
            </button>
            <button
              onClick={() => applyPreset('last-year')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition min-h-[36px] ${
                activePreset === 'last-year'
                  ? 'bg-orange-500/15 text-orange-300'
                  : 'bg-dark-elevated text-dark-secondary hover:text-dark-text'
              }`}
            >
              Último año
            </button>
          {dateFilterActive && (
            <button
              onClick={clearDateFilter}
              className="px-2.5 py-1 text-xs font-medium rounded-md transition text-dark-secondary hover:text-dark-text"
            >
              Limpiar filtro
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setActivePreset(null);
            }}
            className="px-2 py-1 text-xs rounded-md border outline-none focus:border-dark-accent"
            style={{
              backgroundColor: darkColors.elevated,
              borderColor: darkColors.border,
              color: darkColors.text,
            }}
            aria-label="Fecha inicial"
          />
          <span className="text-dark-muted text-xs">a</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setActivePreset(null);
            }}
            className="px-2 py-1 text-xs rounded-md border outline-none focus:border-dark-accent"
            style={{
              backgroundColor: darkColors.elevated,
              borderColor: darkColors.border,
              color: darkColors.text,
            }}
            aria-label="Fecha final"
          />
        </div>
      </div>

      {/* Transaction list */}
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
        {loading || (pageLoading && items.length === 0) ? (
          <div className="divide-y divide-dark-border-subtle">
            {[1, 2, 3, 4, 5].map(n => (
              <div key={n} className="px-5 py-3.5 flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-3.5 w-40 mb-1.5" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center px-6">
            <Receipt className="w-9 h-9 text-dark-muted-dim mb-2" aria-hidden="true" />
            <p className="text-sm font-medium text-dark-secondary">Sin movimientos</p>
            <p className="text-xs text-dark-muted-dim mt-1">
              {filter === 'all' && !dateFilterActive
                ? 'Los movimientos que registres por WhatsApp aparecerán aquí.'
                : 'No hay transacciones en este filtro.'}
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-dark-border-subtle">
              {items.map(tx => (
                <TxRow key={tx.id} tx={tx} onClick={() => openDetail(tx)} />
              ))}
            </div>
            <div className="px-5 py-3 border-t border-dark-border-subtle flex items-center justify-center">
              {pageError ? (
                <button
                  onClick={() => (page === 0 ? loadMoreFromAllInitial() : loadMore())}
                  className="text-xs font-medium text-red-400 hover:text-red-300"
                >
                  Error al cargar. Reintentar
                </button>
              ) : page === 0 && filter === 'all' && !dateFilterActive ? (
                <button
                  onClick={loadMoreFromAllInitial}
                  disabled={pageLoading}
                  className="text-xs font-medium text-orange-400 hover:text-orange-300 disabled:opacity-50"
                >
                  {pageLoading ? 'Cargando...' : 'Cargar más'}
                </button>
              ) : cursor ? (
                <button
                  onClick={loadMore}
                  disabled={pageLoading}
                  className="text-xs font-medium text-orange-400 hover:text-orange-300 disabled:opacity-50"
                >
                  {pageLoading ? 'Cargando...' : 'Cargar más'}
                </button>
              ) : (
                <span className="text-xs text-dark-muted-dim">No hay más movimientos</span>
              )}
            </div>
          </>
        )}
      </div>

      <TransactionDetail
        transaction={selectedTx}
        isOpen={detailOpen}
        onClose={closeDetail}
      />
    </section>
  );
}
