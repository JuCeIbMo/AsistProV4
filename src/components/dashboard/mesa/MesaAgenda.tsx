import type { CSSProperties } from 'react';
import type { Appointment, AppointmentStatus } from '../../../services/dashboardService';
import { STATUS_LABEL } from '../appointmentStatus';

const mono: CSSProperties = { fontFamily: "'JetBrains Mono',monospace" };

const STATUS_COLOR: Record<AppointmentStatus, { bar: string; bg: string; fg: string }> = {
  scheduled: { bar: '#6652B5', bg: '#EAE5F7', fg: '#6652B5' },
  completed: { bar: '#547552', bg: '#E2EDDE', fg: '#547552' },
  cancelled: { bar: '#C94E2C', bg: '#FAE8E2', fg: '#C94E2C' },
  missed: { bar: '#C48B1E', bg: '#FAF0D6', fg: '#C48B1E' },
};

function time(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

interface MesaAgendaProps {
  dayNumber: string;
  monthLabel: string;
  appointments: Appointment[];
}

export function MesaAgenda({ dayNumber, monthLabel, appointments }: MesaAgendaProps) {
  return (
    <section
      className="mesa-card"
      style={{
        position: 'relative',
        background: '#FCFAF2',
        borderRadius: 8,
        boxShadow: '0 16px 34px rgba(70,55,28,.16), inset 0 1px 0 rgba(255,255,255,.6)',
        transform: 'rotate(-.4deg)',
      }}
    >
      {/* washi tapes */}
      <div aria-hidden="true" style={{ position: 'absolute', top: -13, left: 42, width: 104, height: 28, background: 'repeating-linear-gradient(45deg,rgba(201,78,44,.42) 0 7px,rgba(201,78,44,.28) 7px 14px)', transform: 'rotate(-5deg)', boxShadow: '0 3px 5px rgba(0,0,0,.08)', borderLeft: '1px solid rgba(255,255,255,.3)', borderRight: '1px solid rgba(255,255,255,.3)' }} />
      <div aria-hidden="true" style={{ position: 'absolute', top: -11, right: 54, width: 88, height: 26, background: 'repeating-linear-gradient(45deg,rgba(102,82,181,.4) 0 7px,rgba(102,82,181,.26) 7px 14px)', transform: 'rotate(4deg)', boxShadow: '0 3px 5px rgba(0,0,0,.08)' }} />
      {/* clip */}
      <div aria-hidden="true" style={{ position: 'absolute', top: -12, right: 18, width: 17, height: 46, border: '2.5px solid #b3b6bd', borderRadius: 9, transform: 'rotate(8deg)', boxShadow: '0 1px 2px rgba(0,0,0,.18)', zIndex: 4 }}>
        <div style={{ position: 'absolute', left: 2.5, top: 5, right: 2.5, bottom: 11, border: '2.5px solid #c9ccd2', borderRadius: 6 }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '24px 26px 16px', borderBottom: '1px dashed #D9CDA8' }}>
        <div style={{ textAlign: 'center', lineHeight: 1 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 52, color: '#221f1b' }}>{dayNumber}</div>
        </div>
        <div style={{ borderLeft: '1px solid #E0D5B4', paddingLeft: 16 }}>
          <div style={{ ...mono, fontSize: 10, letterSpacing: '.14em', color: '#9a824a', textTransform: 'uppercase' }}>{monthLabel}</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: '#221f1b', marginTop: 2 }}>Agenda de hoy</div>
        </div>
        <div className="mesa-today" style={{ ...mono, marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#8a7c5e', cursor: 'pointer', border: '1px solid rgba(168,153,122,.5)', borderRadius: 7, padding: '6px 12px' }}>
          Hoy ▾
        </div>
      </div>

      <div style={{ padding: '6px 0 14px' }}>
        {appointments.length === 0 ? (
          <div style={{ ...mono, fontSize: 13, color: '#A8997A', padding: '28px 26px', textAlign: 'center' }}>
            Sin citas para hoy.
          </div>
        ) : (
          appointments.map((appt, i) => {
            const color = STATUS_COLOR[appt.status];
            const last = i === appointments.length - 1;
            const person = appt.with_person || appt.title;
            const detail = appt.category?.display_name || appt.description || '';
            const viaWhatsApp = /whatsapp/i.test(appt.location || '');
            return (
              <div
                key={appt.id}
                className="mesa-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '13px 26px',
                  borderBottom: last ? 'none' : '1px solid #F1EBD9',
                }}
              >
                <div style={{ ...mono, fontSize: 13, color: '#6B6560', width: 46 }}>{time(appt.starts_at)}</div>
                <div style={{ width: 3, height: 38, borderRadius: 2, background: color.bar }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: '#221f1b' }}>{person}</div>
                  <div style={{ ...mono, fontSize: 11, color: '#A8997A', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {detail}
                    {viaWhatsApp && (
                      <>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#547552' }} />
                        WhatsApp
                      </>
                    )}
                  </div>
                </div>
                <span style={{ ...mono, fontSize: 10, fontWeight: 500, padding: '3px 10px', borderRadius: 100, background: color.bg, color: color.fg }}>
                  {STATUS_LABEL[appt.status]}
                </span>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
