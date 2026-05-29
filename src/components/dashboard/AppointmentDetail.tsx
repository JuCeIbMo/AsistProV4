import { useEffect, useState } from 'react';
import { X, MapPin, User, Bell, type LucideIcon } from 'lucide-react';
import {
  updateAppointmentStatus,
  type Appointment,
  type AppointmentStatus,
} from '../../services/dashboardService';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useClickOutside } from '../../hooks/useClickOutside';
import { Badge, Button, Modal } from '../ui';
import { darkColors, shadows, zIndex } from '../../styles/tokens';
import {
  STATUS_LABEL,
  STATUS_BADGE_VARIANT,
  STATUS_ICON,
  STATUS_ICON_COLOR,
  STATUS_ICON_BG,
  formatAppointmentDateTime,
} from './appointmentStatus';

interface AppointmentDetailProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (updated: Appointment) => void;
  onUnauthorized: () => void;
}

// Acciones disponibles cuando la cita está programada.
const ACTIONS: { status: AppointmentStatus; label: string; variant: 'primary' | 'danger' | 'secondary' }[] = [
  { status: 'completed', label: 'Completar', variant: 'primary' },
  { status: 'cancelled', label: 'Cancelar', variant: 'danger' },
  { status: 'missed', label: 'Marcar perdida', variant: 'secondary' },
];

const CONFIRM_MESSAGE: Record<AppointmentStatus, string> = {
  scheduled: '¿Reprogramar esta cita?',
  completed: '¿Marcar esta cita como completada?',
  cancelled: '¿Cancelar esta cita?',
  missed: '¿Marcar esta cita como perdida?',
};

export function AppointmentDetail({
  appointment,
  isOpen,
  onClose,
  onStatusChange,
  onUnauthorized,
}: AppointmentDetailProps) {
  const panelRef = useFocusTrap<HTMLDivElement>({ active: isOpen });

  const [confirmStatus, setConfirmStatus] = useState<AppointmentStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset del estado de acciones cuando se abre/cierra el panel.
  useEffect(() => {
    if (!isOpen) {
      setConfirmStatus(null);
      setSubmitting(false);
      setError(null);
    }
  }, [isOpen]);

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

  // Close on Escape key (solo si no hay modal de confirmación abierto)
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !confirmStatus) {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, confirmStatus]);

  // Close on click outside (solo si no hay modal de confirmación abierto)
  useClickOutside(panelRef, () => {
    if (isOpen && !confirmStatus) {
      onClose();
    }
  });

  if (!isOpen || !appointment) return null;

  const Icon = STATUS_ICON[appointment.status];
  const iconCol = STATUS_ICON_COLOR[appointment.status];
  const iconBg = STATUS_ICON_BG[appointment.status];
  const formattedDate = formatAppointmentDateTime(appointment.starts_at, appointment.ends_at);
  const canAct = appointment.status === 'scheduled';

  async function handleConfirm() {
    if (!confirmStatus || !appointment) return;
    setSubmitting(true);
    setError(null);
    const result = await updateAppointmentStatus(appointment.id, confirmStatus);
    if (!result.ok) {
      setSubmitting(false);
      if (result.status === 'unauthorized') {
        onUnauthorized();
      } else {
        setError('No pudimos actualizar la cita. Inténtalo de nuevo.');
      }
      return;
    }
    setSubmitting(false);
    setConfirmStatus(null);
    onStatusChange(result.data.appointment);
  }

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
            Detalle de la cita
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
          {/* Title + status */}
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
              <Icon className={`w-6 h-6 ${iconCol}`} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold" style={{ color: darkColors['text-primary'] }}>
                {appointment.title}
              </p>
              <div className="mt-1">
                <Badge variant={STATUS_BADGE_VARIANT[appointment.status]} size="md">
                  {STATUS_LABEL[appointment.status]}
                </Badge>
              </div>
            </div>
          </div>

          {/* Date / time */}
          <Field label="Fecha y hora" value={formattedDate} />

          {/* Description */}
          {appointment.description && (
            <Field label="Descripción" value={appointment.description} />
          )}

          {/* Location */}
          {appointment.location && (
            <Field label="Ubicación" value={appointment.location} icon={MapPin} />
          )}

          {/* With person */}
          {appointment.with_person && (
            <Field label="Con" value={appointment.with_person} icon={User} />
          )}

          {/* Reminder */}
          {appointment.reminder_minutes != null && (
            <Field
              label="Recordatorio"
              value={`${appointment.reminder_minutes} min antes`}
              icon={Bell}
            />
          )}

          {/* Category */}
          {appointment.category && (
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: darkColors.muted }}
              >
                Categoría
              </p>
              <Badge variant="accent" size="md">
                {appointment.category.display_name}
              </Badge>
            </div>
          )}

          {/* Actions */}
          {canAct && (
            <div className="pt-2 border-t flex flex-wrap gap-2" style={{ borderColor: darkColors.border }}>
              {ACTIONS.map((action) => (
                <Button
                  key={action.status}
                  variant={action.variant}
                  size="md"
                  onClick={() => {
                    setError(null);
                    setConfirmStatus(action.status);
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Confirmación de cambio de estado.
            Se renderiza dentro del panel para que el click-outside del slide-over no lo cierre. */}
        <Modal
          isOpen={confirmStatus !== null}
          onClose={() => {
            if (!submitting) setConfirmStatus(null);
          }}
          title="Confirmar cambio"
        >
          <p className="text-sm mb-2" style={{ color: darkColors.text }}>
            {confirmStatus ? CONFIRM_MESSAGE[confirmStatus] : ''}
          </p>
          {error && (
            <p className="text-red-400 text-sm mb-2" role="alert">
              {error}
            </p>
          )}
          <div className="flex gap-3 justify-end mt-5">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setConfirmStatus(null)}
              disabled={submitting}
            >
              Volver
            </Button>
            <Button
              variant={confirmStatus === 'cancelled' ? 'danger' : 'primary'}
              size="md"
              loading={submitting}
              onClick={handleConfirm}
            >
              Confirmar
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
}) {
  return (
    <div>
      <p
        className="text-xs font-medium uppercase tracking-wider mb-1"
        style={{ color: darkColors.muted }}
      >
        {label}
      </p>
      <p className="text-sm flex items-center gap-1.5" style={{ color: darkColors.text }}>
        {Icon && <Icon className="w-4 h-4 flex-shrink-0" aria-hidden={true} />}
        {value}
      </p>
    </div>
  );
}
