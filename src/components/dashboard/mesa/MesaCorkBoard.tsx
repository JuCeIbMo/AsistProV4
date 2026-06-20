import type { CSSProperties, ReactNode } from 'react';
import { useDraggableNotes } from '../../../hooks/useDraggableNotes';

const mono: CSSProperties = { fontFamily: "'JetBrains Mono',monospace" };

interface Note {
  id: string;
  rot: number;
  pos: CSSProperties;
  width: number;
  minHeight: number;
  paper: string;
  color: string;
  pin: string;
  kicker?: { label: string; color: string };
  body: ReactNode;
}

const NOTES: Note[] = [
  {
    id: 'n1',
    rot: -4,
    pos: { top: 14, left: 12 },
    width: 152,
    minHeight: 148,
    paper: 'linear-gradient(165deg,#F6DC84,#EFCF63)',
    color: '#42360f',
    pin: 'radial-gradient(circle at 35% 30%,#ff9a8b,#C94E2C 62%,#8f2e18)',
    kicker: { label: 'Hoy', color: '#9a7d2a' },
    body: 'Enviar recordatorio a Lucía antes de las 13:00',
  },
  {
    id: 'n2',
    rot: 3,
    pos: { top: 24, right: 8 },
    width: 148,
    minHeight: 140,
    paper: 'linear-gradient(165deg,#EFE6FB,#E0D2F6)',
    color: '#3a2c5e',
    pin: 'radial-gradient(circle at 35% 30%,#b9a6e8,#6652B5 62%,#42357d)',
    kicker: { label: 'Pago', color: '#8170b0' },
    body: 'Confirmar transferencia de Camila — Bs 180',
  },
  {
    id: 'n3',
    rot: -2,
    pos: { bottom: 14, left: 30 },
    width: 150,
    minHeight: 128,
    paper: 'linear-gradient(165deg,#FCE4DC,#F6CFC2)',
    color: '#6e2f1a',
    pin: 'radial-gradient(circle at 35% 30%,#a9c7a3,#547552 62%,#385237)',
    body: 'Reagendar a Andrés → jueves 11:00',
  },
  {
    id: 'n4',
    rot: 4,
    pos: { bottom: 22, right: 18 },
    width: 140,
    minHeight: 120,
    paper: 'linear-gradient(165deg,#E5EFDD,#D3E5C6)',
    color: '#33451f',
    pin: 'radial-gradient(circle at 35% 30%,#f0c97a,#C48B1E 62%,#8a6112)',
    body: 'Llamar a la contadora 14:00 📞',
  },
];

export function MesaCorkBoard() {
  const { register, startDrag } = useDraggableNotes();

  return (
    <section
      style={{
        position: 'relative',
        borderRadius: 10,
        padding: 18,
        border: '13px solid',
        borderImage: 'linear-gradient(150deg,#9c6b3c,#6f4824) 1',
        background: '#C19A6B',
        backgroundImage:
          'radial-gradient(rgba(120,82,42,.5) 1.1px, transparent 1.2px),radial-gradient(rgba(150,110,66,.35) 1.1px, transparent 1.2px)',
        backgroundSize: '13px 13px,17px 17px',
        backgroundPosition: '0 0,7px 9px',
        boxShadow: '0 18px 36px rgba(70,50,24,.28), inset 0 0 40px rgba(80,52,24,.35)',
        minHeight: 392,
      }}
    >
      <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%) rotate(-1.5deg)', background: '#1A1816', color: '#F5F1E8', ...mono, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', padding: '5px 16px', borderRadius: 4, boxShadow: '0 5px 12px rgba(0,0,0,.3)', zIndex: 6 }}>
        Pendientes
      </div>

      {NOTES.map(note => (
        <div
          key={note.id}
          ref={register}
          data-id={note.id}
          data-rot={note.rot}
          onPointerDown={startDrag}
          style={{
            position: 'absolute',
            ...note.pos,
            width: note.width,
            minHeight: note.minHeight,
            background: note.paper,
            padding: '16px 14px 14px',
            borderRadius: 2,
            boxShadow: '0 10px 20px rgba(70,50,20,.28)',
            transform: `rotate(${note.rot}deg)`,
            fontFamily: "'Caveat',cursive",
            fontWeight: 600,
            fontSize: 20,
            lineHeight: 1.18,
            color: note.color,
            cursor: 'grab',
            touchAction: 'none',
            userSelect: 'none',
          }}
        >
          <div style={{ position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)', width: 16, height: 16, borderRadius: '50%', background: note.pin, boxShadow: '0 4px 6px rgba(0,0,0,.32)' }} />
          {note.kicker && (
            <div style={{ ...mono, fontSize: 9, letterSpacing: '.1em', color: note.kicker.color, textTransform: 'uppercase', marginBottom: 4, fontWeight: 500 }}>
              {note.kicker.label}
            </div>
          )}
          {note.body}
        </div>
      ))}
    </section>
  );
}
