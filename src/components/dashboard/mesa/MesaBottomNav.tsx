import type { CSSProperties } from 'react';
import type { DashboardView } from './MesaSidebar';

const mono: CSSProperties = { fontFamily: "'JetBrains Mono',monospace" };

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3L17 8.5V17H13V12H7V17H3V8.5L10 3Z" fill={active ? '#C94E2C' : '#8a7338'} />
    </svg>
  );
}
function CalendarIcon({ active }: { active: boolean }) {
  const c = active ? '#C94E2C' : '#8a7338';
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="14" height="12" rx="2" stroke={c} strokeWidth="1.5" />
      <path d="M3 9H17" stroke={c} strokeWidth="1.5" />
      <path d="M7 3V7M13 3V7" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function FinanceIcon({ active }: { active: boolean }) {
  const c = active ? '#C94E2C' : '#8a7338';
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="9" r="5" stroke={c} strokeWidth="1.5" />
      <path d="M10 6V12M8 8H11.5M8 10H11.5" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M7 14V17M13 14V17M5 17H15" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function SettingsIcon({ active }: { active: boolean }) {
  const c = active ? '#C94E2C' : '#8a7338';
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="2.5" stroke={c} strokeWidth="1.5" />
      <path d="M10 3V5M10 15V17M3 10H5M15 10H17M5.05 5.05L6.46 6.46M13.54 13.54L14.95 14.95M14.95 5.05L13.54 6.46M6.46 13.54L5.05 14.95" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const NAV = [
  { label: 'Inicio',   view: 'inicio'   as DashboardView },
  { label: 'Agenda',   view: 'agenda'   as DashboardView },
  { label: 'Finanzas', view: 'finanzas' as DashboardView },
  { label: 'Ajustes',  view: 'ajustes'  as DashboardView },
] as const;

interface MesaBottomNavProps {
  activeView: DashboardView;
  onNavigate: (view: DashboardView) => void;
}

function NavIcon({ view, active }: { view: DashboardView; active: boolean }) {
  if (view === 'inicio')   return <HomeIcon active={active} />;
  if (view === 'agenda')   return <CalendarIcon active={active} />;
  if (view === 'finanzas') return <FinanceIcon active={active} />;
  return <SettingsIcon active={active} />;
}

export function MesaBottomNav({ activeView, onNavigate }: MesaBottomNavProps) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        display: 'flex',
        background: 'linear-gradient(160deg,#EBDBAB,#E3D0A0)',
        borderTop: '1.5px solid rgba(140,112,52,.35)',
        boxShadow: '0 -8px 24px rgba(90,72,34,.2)',
        paddingBottom: 'env(safe-area-inset-bottom,0px)',
      }}
    >
      {NAV.map(item => {
        const active = activeView === item.view;
        return (
          <button
            key={item.view}
            type="button"
            onClick={() => onNavigate(item.view)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              padding: '10px 0 8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderTop: active ? '2.5px solid #C94E2C' : '2.5px solid transparent',
            }}
          >
            <NavIcon view={item.view} active={active} />
            <span style={{
              ...mono,
              fontSize: 9,
              letterSpacing: '.06em',
              color: active ? '#352507' : '#8a7338',
              fontWeight: active ? 700 : 400,
              textTransform: 'uppercase',
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
