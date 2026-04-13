import { useState, useEffect } from 'react';

// ──────────────────────────────────────────────────────────────
// ActivityTicker — burbuja flotante de actividad en tiempo real
// Componente completamente aislado: eliminar su uso en App.tsx
// no afecta ninguna otra parte de la aplicación.
// ──────────────────────────────────────────────────────────────

const NOTIFICATIONS = [
  { icon: '📅', name: 'María',   action: 'acaba de agendar una reunión' },
  { icon: '💰', name: 'Carlos',  action: 'registró un gasto de $1.800' },
  { icon: '📊', name: 'Ana',     action: 'recibió su resumen mensual' },
  { icon: '⏰', name: 'Roberto', action: 'programó 3 recordatorios' },
  { icon: '✅', name: 'Laura',   action: 'completó su lista del día' },
  { icon: '📱', name: 'Martín',  action: 'sincronizó Google Calendar' },
  { icon: '💬', name: 'Sofía',   action: 'agendó una cita con su médico' },
];

const INTERVAL_MS  = 4000;
const FADE_OUT_MS  = 350;

export default function ActivityTicker() {
  const [index,   setIndex]   = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const tick = setInterval(() => {
      // Fade out
      setVisible(false);

      const swap = setTimeout(() => {
        setIndex((i) => (i + 1) % NOTIFICATIONS.length);
        setVisible(true);
      }, FADE_OUT_MS);

      return () => clearTimeout(swap);
    }, INTERVAL_MS);

    return () => clearInterval(tick);
  }, []);

  const { icon, name, action } = NOTIFICATIONS[index];

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 50, maxWidth: 288 }}
    >
      <div
        style={{
          opacity:    visible ? 1 : 0,
          transform:  visible
            ? 'translateX(0) translateY(0) scale(1)'
            : 'translateX(-14px) translateY(6px) scale(0.97)',
          transition: `opacity ${FADE_OUT_MS}ms cubic-bezier(0.16,1,0.3,1),
                       transform ${FADE_OUT_MS}ms cubic-bezier(0.16,1,0.3,1)`,
          background: 'rgba(255,255,255,0.95)',
          border:     '1px solid rgba(28,18,9,0.08)',
          borderRadius: 18,
          padding:    '10px 14px',
          display:    'flex',
          alignItems: 'flex-start',
          gap:        10,
          boxShadow:  '0 4px 20px rgba(28,18,9,0.10), 0 1px 4px rgba(28,18,9,0.06)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {/* Dot de actividad */}
        <span
          style={{
            marginTop: 3,
            fontSize: 18,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          {icon}
        </span>

        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize:      10,
              fontWeight:    600,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color:         '#9E948C',
              marginBottom:  2,
              fontFamily:    'Outfit, sans-serif',
            }}
          >
            Actividad reciente
          </p>
          <p
            style={{
              fontSize:   13,
              lineHeight: 1.4,
              color:      '#1C1209',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            <strong style={{ fontWeight: 600 }}>{name}</strong>{' '}
            {action}
          </p>
        </div>

        {/* Pulso verde de "en vivo" */}
        <span
          style={{
            marginTop:   5,
            flexShrink:  0,
            width:       7,
            height:      7,
            borderRadius: '50%',
            background:  '#22c55e',
            boxShadow:   '0 0 0 2px rgba(34,197,94,0.25)',
          }}
        />
      </div>
    </div>
  );
}
