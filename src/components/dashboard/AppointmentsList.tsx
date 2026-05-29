import { useEffect, useState } from 'react';
import { CalendarX } from 'lucide-react';
import {
  fetchAppointments,
  type Appointment,
  type AppointmentStatus,
} from '../../services/dashboardService';
import { AppointmentRow } from './AppointmentRow';
import { AppointmentDetail } from './AppointmentDetail';
import { Skeleton } from '../ui';
import { darkColors } from '../../styles/tokens';

type StatusFilter = 'all' | AppointmentStatus;
type DatePreset = 'this-month' | 'last-3-months' | 'last-year';

interface Props {
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

const tabs: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'scheduled', label: 'Programadas' },
  { id: 'completed', label: 'Completadas' },
  { id: 'cancelled', label: 'Canceladas' },
  { id: 'missed', label: 'Perdidas' },
];

export function AppointmentsList({ onUnauthorized }: Props) {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Date filter state
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [activePreset, setActivePreset] = useState<DatePreset | null>(null);

  // Detail panel state
  const [selected, setSelected] = useState<Appointment | null>(null);
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

  function openDetail(appointment: Appointment) {
    setSelected(appointment);
    setDetailOpen(true);
  }

  function closeDetail() {
    setDetailOpen(false);
    setSelected(null);
  }

  function handleStatusChange(updated: Appointment) {
    setItems((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setSelected(updated);
  }

  // (Re)fetch cuando cambian filtros de estado o fechas.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(false);
      const result = await fetchAppointments({
        status: filter === 'all' ? null : filter,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      if (cancelled) return;
      if (!result.ok) {
        if (result.status === 'unauthorized') onUnauthorized();
        else setError(true);
        setLoading(false);
        return;
      }
      setItems(result.data.appointments);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, startDate, endDate, reloadKey]);

  const dateFilterActive = !!(startDate || endDate);

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-xs font-semibold text-dark-muted uppercase tracking-widest">
          Citas
        </h2>
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.05] rounded-lg p-0.5 flex-wrap">
          {tabs.map((t) => (
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

      {/* Appointment list */}
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="divide-y divide-dark-border-subtle">
            {[1, 2, 3, 4, 5].map((n) => (
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
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-14 text-center px-6">
            <p className="text-sm font-medium text-red-400">No pudimos cargar tus citas.</p>
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="mt-3 text-xs font-medium px-4 py-2 rounded-lg bg-orange-500/15 text-orange-300 hover:bg-orange-500/25 transition"
            >
              Reintentar
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center px-6">
            <CalendarX className="w-9 h-9 text-dark-muted-dim mb-2" aria-hidden="true" />
            <p className="text-sm font-medium text-dark-secondary">Sin citas</p>
            <p className="text-xs text-dark-muted-dim mt-1">
              {filter === 'all' && !dateFilterActive
                ? 'Las citas que registres por WhatsApp aparecerán aquí.'
                : 'No hay citas en este filtro.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-dark-border-subtle">
            {items.map((appointment) => (
              <AppointmentRow
                key={appointment.id}
                appointment={appointment}
                onClick={openDetail}
              />
            ))}
          </div>
        )}
      </div>

      <AppointmentDetail
        appointment={selected}
        isOpen={detailOpen}
        onClose={closeDetail}
        onStatusChange={handleStatusChange}
        onUnauthorized={onUnauthorized}
      />
    </section>
  );
}
