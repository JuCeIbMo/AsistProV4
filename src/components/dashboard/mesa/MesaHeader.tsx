import type { CSSProperties } from 'react';

const mono: CSSProperties = { fontFamily: "'JetBrains Mono',monospace" };

interface MesaHeaderProps {
  dateLabel: string;
  greeting: string;
  subtitle: string;
  onReminder: () => void;
}

export function MesaHeader({ dateLabel, greeting, subtitle, onReminder }: MesaHeaderProps) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 24,
        flexWrap: 'wrap',
        marginBottom: 8,
        position: 'relative',
      }}
    >
      <div>
        <div
          style={{
            ...mono,
            fontSize: 11,
            letterSpacing: '.14em',
            color: '#8a7c5e',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: 9,
          }}
        >
          <span style={{ display: 'block', width: 18, height: 1, background: '#C94E2C' }} />
          {dateLabel}
        </div>
        <h1
          style={{
            fontFamily: "'Dancing Script',cursive",
            fontWeight: 700,
            fontSize: 52,
            lineHeight: 1.05,
            margin: '4px 0 10px',
            color: '#221f1b',
            whiteSpace: 'nowrap',
          }}
        >
          {greeting}
        </h1>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: '#6B6560',
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          type="button"
          className="mesa-btn-dark"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '10px 18px',
            borderRadius: 9,
            border: 'none',
            cursor: 'pointer',
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 14,
            fontWeight: 600,
            background: '#1A1816',
            color: '#F5F1E8',
            boxShadow: '0 6px 16px rgba(26,24,22,.28)',
          }}
        >
          <span style={{ fontSize: 17, lineHeight: 0 }}>+</span> Nueva cita
        </button>
        <button
          type="button"
          className="mesa-btn-accent"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '10px 18px',
            borderRadius: 9,
            border: 'none',
            cursor: 'pointer',
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 14,
            fontWeight: 600,
            background: '#C94E2C',
            color: '#fff',
            boxShadow: '0 6px 16px rgba(201,78,44,.3)',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#7bdc8a',
              boxShadow: '0 0 0 3px rgba(123,220,138,.35)',
            }}
          />{' '}
          Cobrar
        </button>
        <button
          type="button"
          onClick={onReminder}
          className="mesa-btn-ghost"
          style={{
            padding: '10px 16px',
            borderRadius: 9,
            cursor: 'pointer',
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 14,
            fontWeight: 500,
            background: 'rgba(255,253,246,.7)',
            color: '#1A1816',
            border: '1.5px solid rgba(168,153,122,.6)',
          }}
        >
          Recordatorio
        </button>
      </div>

      {/* prop: lápiz decorativo */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -14,
          left: 330,
          width: 150,
          height: 13,
          transform: 'rotate(-28deg)',
          pointerEvents: 'none',
          zIndex: 5,
          filter: 'drop-shadow(0 7px 6px rgba(60,45,20,.22))',
        }}
      >
        <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, borderTop: '6.5px solid transparent', borderBottom: '6.5px solid transparent', borderRight: '15px solid #3a322a' }} />
        <div style={{ position: 'absolute', left: 13, top: 0, width: 0, height: 0, borderTop: '6.5px solid transparent', borderBottom: '6.5px solid transparent', borderRight: '13px solid #E8C98E' }} />
        <div style={{ position: 'absolute', left: 24, top: 0, height: 13, width: 96, background: 'linear-gradient(#F2C94C,#E0B23C)', borderTop: '1px solid rgba(255,255,255,.4)' }} />
        <div style={{ position: 'absolute', left: 118, top: 0, height: 13, width: 8, background: '#b9bcc2' }} />
        <div style={{ position: 'absolute', left: 126, top: 0, height: 13, width: 16, background: '#E89A9A', borderRadius: '0 6px 6px 0' }} />
      </div>
    </header>
  );
}
