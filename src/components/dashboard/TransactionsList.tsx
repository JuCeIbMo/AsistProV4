import { useEffect, useState } from 'react';
import { Receipt } from 'lucide-react';
import { fetchTransactionsPage, type Transaction } from '../../services/dashboardService';
import { TxRow } from './TxRow';

type DirFilter = 'all' | 'income' | 'expense';

interface Props {
  initialItems: Transaction[];
  loading: boolean;
  onUnauthorized: () => void;
}

function Skeleton({ className }: { className: string }) {
  return (
    <div
      className={`rounded-lg ${className}`}
      style={{
        background:
          'linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s infinite',
      }}
    />
  );
}

export function TransactionsList({ initialItems, loading, onUnauthorized }: Props) {
  const [filter, setFilter] = useState<DirFilter>('all');
  const [items, setItems] = useState<Transaction[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0); // 0 = first page (initialItems / first fetch)
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState(false);

  // Reload from cursor=null when filter changes
  useEffect(() => {
    if (filter === 'all' && page === 0) {
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
      const result = await fetchTransactionsPage(null, dir, 25);
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
  }, [filter]);

  // Refresh initial items when prop changes (e.g. user clicked refresh)
  useEffect(() => {
    if (filter === 'all') {
      setItems(initialItems);
      setCursor(null);
      setPage(0);
    }
  }, [initialItems, filter]);

  async function loadMore() {
    if (!cursor) return;
    setPageLoading(true);
    setPageError(false);
    const dir = filter === 'all' ? null : filter;
    const result = await fetchTransactionsPage(cursor, dir, 25);
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
    const last = items[items.length - 1];
    // Build a cursor heuristic: we need backend cursor; since the initial recent_transactions
    // already came from `transactions_page(limit=10)` we just need to fetch more.
    // Simplest: re-fetch the first page of 25 to align, then continue. Skip dup by id.
    setPageLoading(true);
    setPageError(false);
    const dir = filter === 'all' ? null : filter;
    const result = await fetchTransactionsPage(null, dir, 25);
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

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">
          Movimientos
        </h2>
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.05] rounded-lg p-0.5">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                filter === t.id
                  ? 'bg-orange-500/15 text-orange-300'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#13131c] border border-white/[0.07] rounded-2xl overflow-hidden">
        {loading || (pageLoading && items.length === 0) ? (
          <div className="divide-y divide-white/[0.04]">
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
            <Receipt className="w-9 h-9 text-gray-700 mb-2" />
            <p className="text-sm font-medium text-gray-500">Sin movimientos</p>
            <p className="text-xs text-gray-700 mt-1">
              {filter === 'all'
                ? 'Los movimientos que registres por WhatsApp aparecerán aquí.'
                : 'No hay transacciones en este filtro.'}
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-white/[0.04]">
              {items.map(tx => (
                <TxRow key={tx.id} tx={tx} />
              ))}
            </div>
            <div className="px-5 py-3 border-t border-white/[0.04] flex items-center justify-center">
              {pageError ? (
                <button
                  onClick={() => (page === 0 ? loadMoreFromAllInitial() : loadMore())}
                  className="text-xs font-medium text-red-400 hover:text-red-300"
                >
                  Error al cargar. Reintentar
                </button>
              ) : page === 0 && filter === 'all' ? (
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
                <span className="text-[11px] text-gray-700">No hay más movimientos</span>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
