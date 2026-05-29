import type { Appointment } from '../../services/dashboardService';
import { Badge } from '../ui';
import {
  STATUS_LABEL,
  STATUS_BADGE_VARIANT,
  STATUS_ICON,
  STATUS_ICON_COLOR,
  STATUS_ICON_BG,
  formatAppointmentDateTime,
} from './appointmentStatus';

interface AppointmentRowProps {
  appointment: Appointment;
  onClick?: (appointment: Appointment) => void;
}

export function AppointmentRow({ appointment, onClick }: AppointmentRowProps) {
  const Icon = STATUS_ICON[appointment.status];
  const iconCol = STATUS_ICON_COLOR[appointment.status];
  const iconBg = STATUS_ICON_BG[appointment.status];

  const label = appointment.title || appointment.category?.display_name || 'Cita';
  const dateTime = formatAppointmentDateTime(appointment.starts_at, appointment.ends_at);
  const subtitle = appointment.location
    ? `${dateTime} · ${appointment.location}`
    : appointment.with_person
    ? `${dateTime} · ${appointment.with_person}`
    : dateTime;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick(appointment);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(appointment);
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
          <p className="text-xs text-dark-muted truncate">{subtitle}</p>
        </div>
      </div>
      <Badge variant={STATUS_BADGE_VARIANT[appointment.status]} size="sm" className="ml-4 flex-shrink-0">
        {STATUS_LABEL[appointment.status]}
      </Badge>
    </div>
  );
}
