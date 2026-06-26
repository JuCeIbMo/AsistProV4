import type { CSSProperties } from 'react';

export type DashboardView = 'inicio' | 'agenda' | 'finanzas' | 'ajustes';

interface NavItem {
  label: string;
  dot: string;
  view: DashboardView | null;
  badge?: string;
}

const NAV: NavItem[] = [
  { label: 'Inicio',    dot: '#352507', view: 'inicio' },
  { label: 'Agenda',   dot: '#6652B5', view: 'agenda' },
  { label: 'Finanzas', dot: '#547552', view: 'finanzas' },
  { label: 'Ajustes',  dot: '#A8997A', view: 'ajustes' },
];

const mono: CSSProperties = { fontFamily: "'JetBrains Mono',monospace" };

interface MesaSidebarProps {
  userName: string;
  userRole: string;
  activeView: DashboardView;
  onNavigate: (view: DashboardView) => void;
  onLogout: () => void;
}

export function MesaSidebar({ userName, userRole, activeView, onNavigate, onLogout }: MesaSidebarProps) {
  const initials = userName
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside style={{ width: 214, flex: 'none', position: 'sticky', top: 30 }}>
      {/* pestaña de la carpeta */}
      <div
        style={{
          width: 118,
          height: 30,
          marginLeft: 18,
          background: 'linear-gradient(#ECDCAC,#E2CE96)',
          borderRadius: '10px 14px 0 0',
          boxShadow: '0 -2px 6px rgba(120,95,40,.12)',
        }}
      />
      <div
        style={{
          background: 'linear-gradient(160deg,#EBDBAB,#E3D0A0)',
          borderRadius: '2px 12px 14px 14px',
          padding: '20px 18px 22px',
          boxShadow: '0 18px 34px rgba(90,72,34,.22), inset 0 1px 0 rgba(255,255,255,.45)',
          border: '1px solid rgba(140,112,52,.25)',
          marginTop: -1,
        }}
      >
        <div
          style={{
            ...mono,
            fontSize: 9.5,
            letterSpacing: '.18em',
            color: '#8a7338',
            textTransform: 'uppercase',
          }}
        >
          agenda · pagos · whatsapp
        </div>
        <div
          style={{
            fontFamily: "'Playfair Display',serif",
            fontWeight: 700,
            fontSize: 30,
            lineHeight: 1,
            margin: '3px 0 18px',
            color: '#352a12',
          }}
        >
          Mesa<span style={{ color: '#C94E2C' }}>.</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV.map((item) => {
            const active = item.view !== null && activeView === item.view;
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.view ? () => onNavigate(item.view!) : undefined}
                className="mesa-nav-item"
                data-active={active || undefined}
                disabled={item.view === null}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  padding: '9px 12px',
                  borderRadius: 7,
                  border: 'none',
                  textAlign: 'left',
                  width: '100%',
                  cursor: item.view ? 'pointer' : 'default',
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  background: active ? '#D9A82E' : 'transparent',
                  color: active ? '#352507' : item.view === null ? '#a89e7e' : '#6a5828',
                  boxShadow: active
                    ? 'inset 0 1px 0 rgba(255,255,255,.4), 0 3px 8px rgba(150,110,20,.3)'
                    : 'none',
                  opacity: item.view === null ? 0.6 : 1,
                }}
              >
                <span
                  style={{ width: 8, height: 8, borderRadius: 2, background: item.dot }}
                  aria-hidden="true"
                />
                {item.label}
                {item.badge && (
                  <span
                    style={{
                      ...mono,
                      marginLeft: 'auto',
                      fontSize: 10,
                      background: '#C94E2C',
                      color: '#fff',
                      borderRadius: 100,
                      padding: '1px 7px',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div
          style={{
            marginTop: 20,
            padding: 12,
            background: 'rgba(255,253,246,.6)',
            border: '1px dashed rgba(140,112,52,.4)',
            borderRadius: 7,
          }}
        >
          <div
            style={{
              ...mono,
              fontSize: 9,
              letterSpacing: '.12em',
              color: '#9a824a',
              textTransform: 'uppercase',
            }}
          >
            Plan Pro
          </div>
          <div style={{ fontSize: 12.5, color: '#5c4d22', marginTop: 2 }}>Renueva el 30 jun</div>
          <div
            style={{
              height: 5,
              background: 'rgba(140,112,52,.2)',
              borderRadius: 100,
              marginTop: 8,
              overflow: 'hidden',
            }}
          >
            <div style={{ width: '68%', height: '100%', background: '#547552', borderRadius: 100 }} />
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          title="Cerrar sesión"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            marginTop: 18,
            paddingTop: 14,
            width: '100%',
            border: 'none',
            background: 'transparent',
            textAlign: 'left',
            cursor: 'pointer',
            borderTop: '1px solid rgba(140,112,52,.25)',
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#C94E2C,#6652B5)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {initials}
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#352a12' }}>{userName}</div>
            <div style={{ ...mono, fontSize: 9.5, color: '#9a824a' }}>{userRole}</div>
          </div>
        </button>
      </div>
    </aside>
  );
}
