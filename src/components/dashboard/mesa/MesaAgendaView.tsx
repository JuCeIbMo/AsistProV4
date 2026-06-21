import { useMemo, type CSSProperties } from 'react';
import type { Appointment, AppointmentStatus } from '../../../services/dashboardService';
import { useMobile } from '../../../hooks/useMobile';

const mono: CSSProperties = { fontFamily: "'JetBrains Mono',monospace" };

const STATUS_COLOR: Record<AppointmentStatus, { bar: string; bg: string; fg: string }> = {
  scheduled: { bar: '#6652B5', bg: '#EAE5F7', fg: '#6652B5' },
  completed:  { bar: '#547552', bg: '#E2EDDE', fg: '#547552' },
  cancelled:  { bar: '#C94E2C', bg: '#FAE8E2', fg: '#C94E2C' },
  missed:     { bar: '#C48B1E', bg: '#FAF0D6', fg: '#C48B1E' },
};

const DAY_LABELS  = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTH_NAMES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const DAY_ROTS    = [-0.6, 0.5, -0.4, 0.6, -0.5, 0.4, -0.3];
const FILL_COLORS = ['#6652B5','#C48B1E','#547552','#6652B5','#C94E2C','#547552','#A8997A'];

const PX_PER_MIN = 56 / 60;
const START_HOUR  = 8;
const HOURS       = [8,9,10,11,12,13,14,15,16,17,18,19];

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getWeekDays(now: Date): Date[] {
  const day  = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const mon  = new Date(now);
  mon.setDate(now.getDate() + diff);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d;
  });
}

function timeToOffset(iso: string): number {
  const d    = new Date(iso);
  const mins = (d.getHours() - START_HOUR) * 60 + d.getMinutes();
  return Math.max(0, mins * PX_PER_MIN);
}

function durationPx(starts: string, ends: string | null): number {
  if (!ends) return 56;
  const mins = (new Date(ends).getTime() - new Date(starts).getTime()) / 60000;
  return Math.max(28, mins * PX_PER_MIN);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface MesaAgendaViewProps {
  appointments: Appointment[];
  now: Date;
}

export function MesaAgendaView({ appointments, now }: MesaAgendaViewProps) {
  const isMobile = useMobile();
  const weekDays = useMemo(() => getWeekDays(now), [now]);

  const byDay = useMemo(() => {
    const m = new Map<string, Appointment[]>();
    weekDays.forEach(d => {
      m.set(d.toDateString(), appointments.filter(a => isSameDay(new Date(a.starts_at), d)));
    });
    return m;
  }, [weekDays, appointments]);

  const todayAppts = useMemo(() =>
    appointments
      .filter(a => isSameDay(new Date(a.starts_at), now))
      .sort((a, b) => a.starts_at.localeCompare(b.starts_at)),
    [appointments, now],
  );

  const maxDay = useMemo(() => {
    let max = 1;
    byDay.forEach(v => { if (v.length > max) max = v.length; });
    return max;
  }, [byDay]);

  const nowOffset = (now.getHours() - START_HOUR) * 60 * PX_PER_MIN + now.getMinutes() * PX_PER_MIN;
  const isNowVisible = now.getHours() >= START_HOUR && now.getHours() < 20;

  const weekAppts = useMemo(() =>
    appointments.filter(a => weekDays.some(wd => isSameDay(new Date(a.starts_at), wd))),
    [appointments, weekDays],
  );
  const scheduledCount = weekAppts.filter(a => a.status === 'scheduled').length;
  const completedCount = weekAppts.filter(a => a.status === 'completed').length;
  const cancelledCount = weekAppts.filter(a => a.status === 'cancelled' || a.status === 'missed').length;
  const totalWeek      = weekAppts.length || 1;
  const donutV  = Math.round((scheduledCount / totalWeek) * 360);
  const donutG  = Math.round((completedCount  / totalWeek) * 360);
  const donut   = `conic-gradient(#6652B5 0 ${donutV}deg,#547552 ${donutV}deg ${donutV + donutG}deg,#C94E2C ${donutV + donutG}deg 360deg)`;

  // mini calendar
  const firstWeekDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay() || 7;
  const daysInMonth  = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const apptDays     = new Set(appointments.map(a => new Date(a.starts_at).getDate()));

  const monthLabel = `${capitalize(MONTH_NAMES[now.getMonth()])} ${now.getFullYear()}`;
  const weekLabel  = isMobile
    ? `Sem. ${weekDays[0].getDate()}–${weekDays[6].getDate()} ${capitalize(MONTH_NAMES[now.getMonth()])}`
    : `Semana del ${weekDays[0].getDate()} al ${weekDays[6].getDate()} · ${capitalize(MONTH_NAMES[now.getMonth()])} ${now.getFullYear()}`;

  return (
    <section>
      {/* HEADER */}
      <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 22 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...mono, fontSize: 11, letterSpacing: '.14em', color: '#8a7c5e', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ display: 'block', width: 18, height: 1, background: '#6652B5', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{weekLabel}</span>
          </div>
          <h1 style={{ fontFamily: "'Dancing Script',cursive", fontWeight: 700, fontSize: isMobile ? 38 : 52, lineHeight: 1.05, margin: '4px 0 10px', color: '#221f1b' }}>
            Tu agenda
          </h1>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6B6560', margin: 0 }}>
            {weekAppts.length} citas esta semana · {todayAppts.length} hoy
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="mesa-btn-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: isMobile ? '9px 14px' : '10px 18px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, background: '#1A1816', color: '#F5F1E8', boxShadow: '0 6px 16px rgba(26,24,22,.28)' }}>
            <span style={{ fontSize: 17, lineHeight: 0 }}>+</span> Nueva cita
          </button>
          {!isMobile && (
            <button className="mesa-btn-ghost" style={{ padding: '10px 16px', borderRadius: 9, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, background: 'rgba(255,253,246,.7)', color: '#1A1816', border: '1.5px solid rgba(168,153,122,.6)' }}>
              Bloquear horario
            </button>
          )}
        </div>
      </header>

      {/* WEEK STRIP */}
      <div style={{ overflowX: isMobile ? 'auto' : 'visible', marginBottom: 30, paddingBottom: isMobile ? 6 : 0 }}>
        <div style={{ display: 'flex', gap: isMobile ? 8 : 12, flexWrap: isMobile ? 'nowrap' : 'wrap' }}>
          {weekDays.map((d, i) => {
            const dayAppts = byDay.get(d.toDateString()) || [];
            const isToday  = isSameDay(d, now);
            const fillPct  = dayAppts.length > 0 ? Math.round((dayAppts.length / maxDay) * 100) : 0;
            return (
              <div
                key={d.toDateString()}
                className="mesa-lift"
                style={{
                  flex: isMobile ? '0 0 68px' : 1,
                  minWidth: isMobile ? 68 : 92,
                  position: 'relative',
                  background: i === 6 ? '#F4EFE2' : '#FCFAF2',
                  borderRadius: 8,
                  padding: isMobile ? '10px 6px 8px' : '14px 10px 12px',
                  textAlign: 'center',
                  boxShadow: isToday ? '0 12px 24px rgba(70,55,28,.18)' : '0 8px 16px rgba(70,55,28,.1)',
                  transform: isToday ? 'translateY(-4px) rotate(-.6deg)' : `rotate(${DAY_ROTS[i]}deg)`,
                  border: isToday ? '1.5px solid #6652B5' : 'none',
                  cursor: 'pointer',
                  opacity: i === 6 && dayAppts.length === 0 ? 0.72 : 1,
                }}
              >
                {isToday && (
                  <div aria-hidden="true" style={{ position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%) rotate(-4deg)', width: 44, height: 14, background: 'repeating-linear-gradient(45deg,rgba(102,82,181,.4) 0 6px,rgba(102,82,181,.24) 6px 12px)', boxShadow: '0 2px 3px rgba(0,0,0,.08)' }} />
                )}
                <div style={{ ...mono, fontSize: 9, letterSpacing: '.1em', color: isToday ? '#6652B5' : '#9a824a', textTransform: 'uppercase' }}>{DAY_LABELS[i]}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: isMobile ? 20 : 28, color: '#221f1b', lineHeight: 1.1 }}>
                  {isToday
                    ? <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: isMobile ? 26 : 34, height: isMobile ? 26 : 34, borderRadius: '50%', background: '#D9A82E', color: '#352507', fontSize: isMobile ? 16 : 22, boxShadow: '0 2px 6px rgba(150,110,20,.35)' }}>{d.getDate()}</span>
                    : <span style={{ color: i === 6 && dayAppts.length === 0 ? '#A8997A' : '#221f1b' }}>{d.getDate()}</span>
                  }
                </div>
                <div style={{ height: 4, borderRadius: 100, background: '#ECE4D0', overflow: 'hidden', margin: '5px 4px 0' }}>
                  {fillPct > 0 && <div style={{ width: `${fillPct}%`, height: '100%', background: FILL_COLORS[i], borderRadius: 100 }} />}
                </div>
                <div style={{ ...mono, fontSize: 9, color: dayAppts.length === 0 ? '#A8997A' : '#9a824a', marginTop: 4 }}>
                  {dayAppts.length === 0 ? 'Libre' : `${dayAppts.length}c`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TWO COLUMN */}
      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* PLANNER */}
        <div style={{ flex: 1.7, minWidth: isMobile ? '100%' : 360 }}>
          <section style={{ position: 'relative', background: '#FCFAF2', borderRadius: 8, boxShadow: '0 16px 34px rgba(70,55,28,.16), inset 0 1px 0 rgba(255,255,255,.6)', overflow: 'hidden' }}>
            <div aria-hidden="true" style={{ position: 'absolute', top: -12, right: 60, width: 96, height: 26, background: 'repeating-linear-gradient(45deg,rgba(84,117,82,.4) 0 7px,rgba(84,117,82,.26) 7px 14px)', transform: 'rotate(3deg)', boxShadow: '0 3px 5px rgba(0,0,0,.08)', zIndex: 5 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: isMobile ? '16px 16px 12px' : '22px 26px 16px', borderBottom: '1px dashed #D9CDA8', flexWrap: 'wrap' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: isMobile ? 18 : 24, color: '#221f1b' }}>
                {capitalize(now.toLocaleDateString('es-ES', { weekday: 'long' }))} {now.getDate()}
              </div>
              <div style={{ ...mono, fontSize: 11, color: '#9a824a' }}>{todayAppts.length} citas</div>
              {!isMobile && (
                <div style={{ marginLeft: 'auto', display: 'flex', border: '1px solid rgba(168,153,122,.5)', borderRadius: 7, overflow: 'hidden', ...mono, fontSize: 11 }}>
                  <span style={{ padding: '6px 12px', background: '#1A1816', color: '#F5F1E8' }}>Día</span>
                  <span style={{ padding: '6px 12px', color: '#8a7c5e', cursor: 'pointer' }}>Semana</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', padding: isMobile ? '10px 12px 16px 6px' : '14px 22px 22px 10px' }}>
              {/* hour gutter */}
              <div style={{ width: 44, flex: 'none' }}>
                {HOURS.map(h => (
                  <div key={h} style={{ height: 56, ...mono, fontSize: 10, color: '#b3a785', textAlign: 'right', paddingRight: 8, display: 'flex', alignItems: 'flex-start', paddingTop: 2 }}>
                    {String(h).padStart(2, '0')}:00
                  </div>
                ))}
              </div>
              {/* ruled grid */}
              <div style={{ position: 'relative', flex: 1, height: 56 * HOURS.length, backgroundImage: 'repeating-linear-gradient(#EFE8D5 0 1px,transparent 1px 56px)', borderLeft: '2px solid #F0CFC4' }}>
                {isNowVisible && (
                  <div style={{ position: 'absolute', left: 0, right: 0, top: nowOffset, height: 0, borderTop: '2px dashed #C94E2C', zIndex: 4 }}>
                    <div style={{ position: 'absolute', left: -5, top: -5, width: 9, height: 9, borderRadius: '50%', background: '#C94E2C' }} />
                    <div style={{ position: 'absolute', right: 0, top: -18, ...mono, fontSize: 9, color: '#C94E2C', background: '#FCFAF2', padding: '0 4px' }}>ahora</div>
                  </div>
                )}
                {todayAppts.map(a => {
                  const top    = timeToOffset(a.starts_at);
                  const height = durationPx(a.starts_at, a.ends_at);
                  const col    = STATUS_COLOR[a.status];
                  const person = a.with_person || a.title;
                  const t0 = new Date(a.starts_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                  const t1 = a.ends_at ? new Date(a.ends_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null;
                  return (
                    <div
                      key={a.id}
                      className="mesa-lift"
                      style={{ position: 'absolute', left: 6, right: 6, top, height, background: col.bg, borderLeft: `4px solid ${col.bar}`, borderRadius: 6, padding: '6px 8px', boxShadow: '0 5px 12px rgba(70,55,28,.12)', cursor: 'pointer', overflow: 'hidden' }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 12, color: '#221f1b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{person}</div>
                      <div style={{ ...mono, fontSize: 10, color: col.fg }}>{t0}{t1 ? `–${t1}` : ''}{!isMobile && a.category ? ` · ${a.category.display_name}` : ''}</div>
                    </div>
                  );
                })}
                {todayAppts.length === 0 && (
                  <div style={{ position: 'absolute', left: 6, right: 6, top: 56, height: 52, border: '1.5px dashed #C9BD9A', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', ...mono, fontSize: 11, color: '#A8997A', cursor: 'pointer' }}>
                    Sin citas para hoy
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <div style={{ flex: 1, minWidth: isMobile ? '100%' : 280, display: 'flex', flexDirection: 'column', gap: 30 }}>

          {/* MINI CALENDAR */}
          <section className="mesa-card" style={{ position: 'relative', background: '#FCFAF2', borderRadius: 8, padding: '18px 18px 20px', boxShadow: '0 14px 30px rgba(70,55,28,.16)', transform: 'rotate(-.5deg)' }}>
            <div aria-hidden="true" style={{ position: 'absolute', top: -11, left: 24, width: 80, height: 24, background: 'repeating-linear-gradient(45deg,rgba(201,78,44,.4) 0 7px,rgba(201,78,44,.26) 7px 14px)', transform: 'rotate(-4deg)', boxShadow: '0 3px 5px rgba(0,0,0,.08)' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, color: '#221f1b' }}>{monthLabel}</div>
              <div style={{ display: 'flex', gap: 8, ...mono, fontSize: 13, color: '#8a7c5e' }}>
                <span style={{ cursor: 'pointer' }}>‹</span><span style={{ cursor: 'pointer' }}>›</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, ...mono, fontSize: 9.5, color: '#b3a785', textAlign: 'center', marginBottom: 6, textTransform: 'uppercase' }}>
              {['L','M','X','J','V','S','D'].map(l => <div key={l}>{l}</div>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, textAlign: 'center', fontSize: 12, color: '#5c5648' }}>
              {Array.from({ length: firstWeekDay - 1 }, (_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day     = i + 1;
                const isToday = day === now.getDate();
                const hasCita = apptDays.has(day);
                return (
                  <div key={day} style={{ padding: '5px 0', position: 'relative' }}>
                    {isToday
                      ? <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: '#D9A82E', color: '#352507', fontWeight: 700, boxShadow: '0 2px 6px rgba(150,110,20,.35)' }}>{day}</span>
                      : day
                    }
                    {hasCita && !isToday && (
                      <span style={{ position: 'absolute', bottom: 1, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#6652B5' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* WEEK DONUT */}
          <section className="mesa-card" style={{ background: '#FCFAF2', borderRadius: 8, padding: 20, boxShadow: '0 14px 30px rgba(70,55,28,.16)', transform: 'rotate(.4deg)' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: '#221f1b', marginBottom: 14 }}>Estado de la semana</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ width: 96, height: 96, borderRadius: '50%', flex: 'none', background: donut, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px rgba(70,55,28,.18)' }}>
                <div style={{ width: 62, height: 62, borderRadius: '50%', background: '#FCFAF2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 22, color: '#221f1b', lineHeight: 1 }}>{weekAppts.length}</div>
                  <div style={{ ...mono, fontSize: 8.5, color: '#9a824a' }}>citas</div>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9, ...mono, fontSize: 11 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#5c5648' }}>
                  <span style={{ width: 9, height: 9, borderRadius: 2, background: '#6652B5', flexShrink: 0 }} />Confirmadas<span style={{ marginLeft: 'auto', color: '#221f1b' }}>{scheduledCount}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#5c5648' }}>
                  <span style={{ width: 9, height: 9, borderRadius: 2, background: '#547552', flexShrink: 0 }} />Completadas<span style={{ marginLeft: 'auto', color: '#221f1b' }}>{completedCount}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#5c5648' }}>
                  <span style={{ width: 9, height: 9, borderRadius: 2, background: '#C94E2C', flexShrink: 0 }} />Canceladas<span style={{ marginLeft: 'auto', color: '#221f1b' }}>{cancelledCount}</span>
                </div>
              </div>
            </div>
          </section>

          {/* FREE SLOTS */}
          <section style={{ background: 'rgba(255,253,246,.7)', border: '1px dashed rgba(140,112,52,.4)', borderRadius: 8, padding: '16px 18px' }}>
            <div style={{ ...mono, fontSize: 10, letterSpacing: '.12em', color: '#9a824a', textTransform: 'uppercase', marginBottom: 11 }}>Próximas citas hoy</div>
            {todayAppts.length === 0 ? (
              <div style={{ ...mono, fontSize: 12, color: '#A8997A' }}>Sin citas pendientes.</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {todayAppts
                  .filter(a => a.status === 'scheduled')
                  .slice(0, 4)
                  .map(a => (
                    <span key={a.id} style={{ ...mono, fontSize: 12, color: '#547552', border: '1px solid #9cb89a', borderRadius: 7, padding: '6px 11px', cursor: 'pointer' }}>
                      {new Date(a.starts_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  ))
                }
              </div>
            )}
          </section>

        </div>
      </div>
    </section>
  );
}
