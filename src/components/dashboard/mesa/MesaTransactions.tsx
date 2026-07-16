import { type CSSProperties, useEffect, useState } from 'react';
import { fetchTransactionsPage, type Transaction } from '../../../services/dashboardService';
import { TransactionDetail } from '../TransactionDetail';
import { fmt } from '../format';
import { useMobile } from '../../../hooks/useMobile';

const mono: CSSProperties = { fontFamily: "'JetBrains Mono',monospace" };

type DirFilter = 'all' | 'income' | 'expense';
type DatePreset = 'this-month' | 'last-3-months' | 'last-year';

interface Props {
  initialItems: Transaction[];
  currency: string;
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

function pillStyle(active: boolean): CSSProperties {
  return {
    ...mono,
    fontSize: 10.5,
    letterSpacing: '.06em',
    padding: '6px 12px',
    borderRadius: 100,
    border: '1px solid ' + (active ? '#547552' : '#DCD2B4'),
    background: active ? '#547552' : 'transparent',
    color: active ? '#FCFAF2' : '#7a6e55',
    cursor: 'pointer',
  };
}

export function MesaTransactions({ initialItems, currency, onUnauthorized }: Props) {
  const isMobile = useMobile();
  const [filter, setFilter] = useState<DirFilter>('all');
  const [items, setItems] = useState<Transaction[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState(false);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [activePreset, setActivePreset] = useState<DatePreset | null>(null);

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
      const result = await fetchTransactionsPage(null, dir, 25, startDate || undefined, endDate || undefined);
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
    const result = await fetchTransactionsPage(cursor, dir, 25, startDate || undefined, endDate || undefined);
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

  async function loadMoreFromAllInitial() {
    if (items.length === 0) return;
    setPageLoading(true);
    setPageError(false);
    const dir = filter === 'all' ? null : filter;
    const result = await fetchTransactionsPage(null, dir, 25, startDate || undefined, endDate || undefined);
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

  function openDetail(tx: Transaction) {
    setSelectedTx(tx);
    setDetailOpen(true);
  }

  const tabs: { id: DirFilter; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'income', label: 'Ingresos' },
    { id: 'expense', label: 'Egresos' },
  ];
  const presets: { id: DatePreset; label: string }[] = [
    { id: 'this-month', label: 'Este mes' },
    { id: 'last-3-months', label: 'Últimos 3 meses' },
    { id: 'last-year', label: 'Último año' },
  ];
  const dateFilterActive = !!(startDate || endDate);

  return (
    <section className="mesa-card" style={{ background: '#FCFAF2', borderRadius: 8, padding: isMobile ? '18px 16px' : '24px 28px', boxShadow: '0 14px 30px rgba(70,55,28,.16)', transform: 'rotate(-.2deg)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: '#221f1b' }}>Movimientos registrados</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)} style={pillStyle(filter === t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 18 }}>
        {presets.map(p => (
          <button key={p.id} onClick={() => applyPreset(p.id)} style={pillStyle(activePreset === p.id)}>
            {p.label}
          </button>
        ))}
        {dateFilterActive && (
          <button onClick={clearDateFilter} style={{ ...mono, fontSize: 10.5, color: '#C94E2C', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 4px' }}>
            Limpiar filtro
          </button>
        )}
        <input
          type="date"
          value={startDate}
          onChange={e => { setStartDate(e.target.value); setActivePreset(null); }}
          aria-label="Fecha inicial"
          style={{ ...mono, fontSize: 11, padding: '5px 8px', borderRadius: 4, border: '1px solid #DCD2B4', background: '#FFFDF7', color: '#5c5648' }}
        />
        <span style={{ ...mono, fontSize: 11, color: '#9a824a' }}>a</span>
        <input
          type="date"
          value={endDate}
          onChange={e => { setEndDate(e.target.value); setActivePreset(null); }}
          aria-label="Fecha final"
          style={{ ...mono, fontSize: 11, padding: '5px 8px', borderRadius: 4, border: '1px solid #DCD2B4', background: '#FFFDF7', color: '#5c5648' }}
        />
      </div>

      {pageLoading && items.length === 0 ? (
        <div style={{ ...mono, fontSize: 12.5, color: '#A8997A', textAlign: 'center', padding: '30px 0' }}>Cargando movimientos…</div>
      ) : items.length === 0 ? (
        <div style={{ ...mono, fontSize: 12.5, color: '#A8997A', textAlign: 'center', padding: '30px 0', lineHeight: 1.6 }}>
          {filter === 'all' && !dateFilterActive
            ? 'Sin movimientos todavía. Los que registres por WhatsApp aparecerán aquí.'
            : 'No hay movimientos para este filtro.'}
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {items.map((tx, i) => (
              <button
                key={tx.id}
                onClick={() => openDetail(tx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  borderTop: i === 0 ? 'none' : '1px dashed #E6DCC2',
                  padding: '12px 4px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#221f1b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tx.description || tx.category || (tx.direction === 'income' ? 'Ingreso' : tx.direction === 'expense' ? 'Gasto' : 'Transferencia')}
                  </div>
                  <div style={{ ...mono, fontSize: 10.5, color: '#9a824a', marginTop: 2 }}>
                    {(tx.category || (tx.direction === 'income' ? 'Ingreso' : tx.direction === 'expense' ? 'Gasto' : 'Transferencia'))}
                    {' · '}
                    {new Date(tx.occurred_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ ...mono, fontSize: 13, flexShrink: 0, color: tx.direction === 'income' ? '#547552' : tx.direction === 'expense' ? '#C94E2C' : '#5c5648' }}>
                  {tx.direction === 'income' ? '+' : tx.direction === 'expense' ? '−' : ''} {currency} {fmt(tx.amount)}
                </div>
              </button>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            {pageError ? (
              <button
                onClick={() => (page === 0 ? loadMoreFromAllInitial() : loadMore())}
                style={{ ...mono, fontSize: 11, color: '#C94E2C', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Error al cargar. Reintentar
              </button>
            ) : page === 0 && filter === 'all' && !dateFilterActive ? (
              <button
                onClick={loadMoreFromAllInitial}
                disabled={pageLoading}
                style={{ ...mono, fontSize: 11, color: '#547552', background: 'none', border: 'none', cursor: 'pointer', opacity: pageLoading ? 0.5 : 1 }}
              >
                {pageLoading ? 'Cargando…' : 'Cargar más'}
              </button>
            ) : cursor ? (
              <button
                onClick={loadMore}
                disabled={pageLoading}
                style={{ ...mono, fontSize: 11, color: '#547552', background: 'none', border: 'none', cursor: 'pointer', opacity: pageLoading ? 0.5 : 1 }}
              >
                {pageLoading ? 'Cargando…' : 'Cargar más'}
              </button>
            ) : (
              <span style={{ ...mono, fontSize: 11, color: '#A8997A' }}>No hay más movimientos</span>
            )}
          </div>
        </>
      )}

      <TransactionDetail transaction={selectedTx} isOpen={detailOpen} onClose={() => setDetailOpen(false)} />
    </section>
  );
}
