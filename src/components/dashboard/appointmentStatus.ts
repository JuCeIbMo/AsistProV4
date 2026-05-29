import { CalendarClock, CheckCircle2, XCircle, AlertTriangle, type LucideIcon } from 'lucide-react';
import type { AppointmentStatus } from '../../services/dashboardService';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent';

export const STATUS_LABEL: Record<AppointmentStatus, string> = {
  scheduled: 'Programada',
  completed: 'Completada',
  cancelled: 'Cancelada',
  missed: 'Perdida',
};

export const STATUS_BADGE_VARIANT: Record<AppointmentStatus, BadgeVariant> = {
  scheduled: 'info',
  completed: 'success',
  cancelled: 'danger',
  missed: 'warning',
};

export const STATUS_ICON: Record<AppointmentStatus, LucideIcon> = {
  scheduled: CalendarClock,
  completed: CheckCircle2,
  cancelled: XCircle,
  missed: AlertTriangle,
};

export const STATUS_ICON_COLOR: Record<AppointmentStatus, string> = {
  scheduled: 'text-blue-400',
  completed: 'text-green-400',
  cancelled: 'text-red-400',
  missed: 'text-yellow-400',
};

export const STATUS_ICON_BG: Record<AppointmentStatus, string> = {
  scheduled: 'bg-blue-500/10',
  completed: 'bg-green-500/10',
  cancelled: 'bg-red-500/10',
  missed: 'bg-yellow-500/10',
};

/** Convierte un ISO UTC (con Z) a fecha + hora en la zona local del usuario. */
export function formatAppointmentDateTime(startsAt: string, endsAt?: string | null): string {
  const start = new Date(startsAt);
  const datePart = start.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const startTime = start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  if (endsAt) {
    const endTime = new Date(endsAt).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${datePart} · ${startTime} – ${endTime}`;
  }
  return `${datePart} · ${startTime}`;
}
