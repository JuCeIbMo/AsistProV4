import { useEffect, useRef, useState } from 'react';
import {
  Check,
  ChevronRight,
  MessageCircle,
  Mic,
  MoveRight,
  Send,
  Star,
  X,
  Zap,
} from 'lucide-react';
import type { PricingPlan } from './content';
import {
  chatMessages,
  features,
  footerColumns,
  getPricingPlans,
  heroStatusItems,
  navItems,
  processSteps,
  stats,
  testimonials,
} from './content';

/* ── Paleta Mesa ── */
const C = {
  desk:         '#E4DCC8',
  paper:        '#FCFAF2',
  manila:       '#EBDBAB',
  manilaDeep:   '#E3D0A0',
  ink:          '#1A1816',
  inkSoft:      '#221f1b',
  terracotta:   '#C94E2C',
  gold:         '#D9A82E',
  violet:       '#6652B5',
  green:        '#547552',
  amber:        '#C48B1E',
  muted:        '#A8997A',
  mutedDeep:    '#8a7c5e',
  label:        '#9a824a',
};

/* ── Shadows ── */
const shadow = {
  card:   '0 10px 22px rgba(70,55,28,.13)',
  folder: '0 18px 34px rgba(90,72,34,.22), inset 0 1px 0 rgba(255,255,255,.45)',
  heavy:  '0 26px 46px rgba(70,55,28,.22)',
  accent: '0 6px 16px rgba(201,78,44,.32)',
  dark:   '0 20px 42px rgba(26,24,22,.32)',
};

/* ── Washi tape strip ── */
function WashiTape({
  top, left, width = 96, rotate = -4, color = C.terracotta,
}: { top: number; left: number; width?: number; rotate?: number; color?: string }) {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', top, left, width, height: 26,
        background: `repeating-linear-gradient(45deg,rgba(${r},${g},${b},.42) 0 7px,rgba(${r},${g},${b},.26) 7px 14px)`,
        transform: `rotate(${rotate}deg)`,
        boxShadow: '0 3px 5px rgba(0,0,0,.08)',
        borderLeft: '1px solid rgba(255,255,255,.3)',
        borderRight: '1px solid rgba(255,255,255,.3)',
        zIndex: 4,
      }}
    />
  );
}

/* ── Paper clip ── */
function PaperClip({ top, right, rotate = 8 }: { top: number; right: number; rotate?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', top, right,
        width: 17, height: 46,
        border: '2.5px solid #b3b6bd',
        borderRadius: 9,
        transform: `rotate(${rotate}deg)`,
        boxShadow: '0 1px 2px rgba(0,0,0,.18)',
        zIndex: 4,
      }}
    >
      <div style={{
        position: 'absolute', left: 2.5, top: 5, right: 2.5, bottom: 11,
        border: '2.5px solid #c9ccd2', borderRadius: 6,
      }} />
    </div>
  );
}

/* ── Ticket stub perforation holes ── */
function TicketHoles() {
  return (
    <>
      <div aria-hidden="true" style={{
        position: 'absolute', left: -7, top: '50%', transform: 'translateY(-50%)',
        width: 14, height: 14, borderRadius: '50%', background: C.desk,
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', right: -7, top: '50%', transform: 'translateY(-50%)',
        width: 14, height: 14, borderRadius: '50%', background: C.desk,
      }} />
    </>
  );
}

/* ── Stat counter ── */
function StatCounter({
  value, prefix = '', suffix = '', label,
}: { value: number; prefix?: string; suffix?: string; label: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStarted(true); observer.disconnect(); }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1500;
    const startedAt = Date.now();
    const tick = () => {
      const progress = Math.min((Date.now() - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, value]);

  return (
    <div ref={ref} className="text-center">
      <p style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 44, fontWeight: 700, color: C.inkSoft, lineHeight: 1.1, margin: 0 }}>
        {prefix}{count >= 1000 ? count.toLocaleString('es-AR') : count}{suffix}
      </p>
      <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.label, marginTop: 8 }}>
        {label}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   HEADER
══════════════════════════════════════════════ */
export function LandingHeader({
  isMenuOpen, scrolled, onToggleMenu,
}: { isMenuOpen: boolean; scrolled: boolean; onToggleMenu: () => void }) {
  return (
    <header className="sticky top-0 z-50 transition-all duration-300" style={{ paddingTop: scrolled ? 12 : 20 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="flex items-center justify-between rounded-2xl px-4 sm:px-6 py-3.5 transition-all duration-300"
          style={{
            background: scrolled
              ? 'rgba(26,24,22,0.94)'
              : `linear-gradient(160deg, ${C.manila}, ${C.manilaDeep})`,
            border: scrolled ? '1px solid rgba(255,255,255,0.06)' : `1px solid rgba(140,112,52,.25)`,
            boxShadow: scrolled ? shadow.dark : shadow.folder,
            backdropFilter: 'blur(14px)',
          }}
        >
          {/* Logo */}
          <div>
            <span style={{
              display: 'block',
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 22, fontWeight: 700, lineHeight: 1,
              color: scrolled ? '#F5F1E8' : '#352a12',
            }}>
              AsistPro<span style={{ color: C.terracotta }}>.</span>
            </span>
            <span style={{
              display: 'block',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: scrolled ? C.muted : C.label,
            }}>
              agenda · pagos · whatsapp
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(([href, label]) => (
              <a key={href} href={href} style={{
                fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'color .18s',
                color: scrolled ? C.muted : '#6a5828',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = scrolled ? '#F5F1E8' : '#352a12')}
                onMouseLeave={e => (e.currentTarget.style.color = scrolled ? C.muted : '#6a5828')}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a href="/login" style={{
              padding: '9px 18px', borderRadius: 9, display: 'inline-flex', alignItems: 'center',
              fontSize: 14, fontWeight: 500, textDecoration: 'none', minHeight: 44,
              border: scrolled ? '1.5px solid rgba(255,255,255,0.14)' : `1.5px solid rgba(140,112,52,.4)`,
              color: scrolled ? C.muted : '#6a5828',
              transition: 'border-color .18s, color .18s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = scrolled ? '#F5F1E8' : '#352a12'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = scrolled ? C.muted : '#6a5828'; }}
            >
              Ingresar
            </a>
            <a href="#pricing" className="mesa-btn-accent" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '9px 20px', borderRadius: 9, border: 'none',
              fontSize: 14, fontWeight: 600, textDecoration: 'none', minHeight: 44,
              background: C.terracotta, color: '#fff',
              boxShadow: shadow.accent, transition: 'background .18s, transform .18s',
            }}>
              Empezar
            </a>
          </div>

          <button
            className="md:hidden p-2 rounded-lg flex items-center justify-center"
            style={{
              minHeight: 44, minWidth: 44,
              border: scrolled ? '1.5px solid rgba(255,255,255,.14)' : `1.5px solid rgba(140,112,52,.4)`,
              color: scrolled ? '#F5F1E8' : '#352a12', background: 'transparent', cursor: 'pointer',
            }}
            onClick={onToggleMenu}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : (
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-3 rounded-2xl px-4 py-4" style={{
            background: `linear-gradient(160deg, rgba(235,219,171,.97), rgba(227,208,160,.95))`,
            border: `1px solid rgba(140,112,52,.25)`,
            boxShadow: shadow.folder,
          }}>
            <nav className="flex flex-col gap-2">
              {navItems.map(([href, label]) => (
                <a key={href} href={href} style={{
                  minHeight: 44, display: 'flex', alignItems: 'center',
                  fontSize: 15, color: '#6a5828', fontWeight: 500, textDecoration: 'none',
                }}>{label}</a>
              ))}
              <a href="/login" style={{ minHeight: 44, display: 'flex', alignItems: 'center', fontSize: 15, color: '#6a5828', fontWeight: 500, textDecoration: 'none' }}>Ingresar</a>
              <a href="#pricing" style={{
                minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 9, background: C.terracotta, color: '#fff',
                fontSize: 15, fontWeight: 600, textDecoration: 'none',
              }}>Empezar</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════
   HERO
══════════════════════════════════════════════ */
export function HeroSection({
  visibleCount, isTyping, onWhatsAppRedirect,
}: { visibleCount: number; isTyping: boolean; onWhatsAppRedirect: () => void }) {
  return (
    <section className="relative pt-16 pb-24 lg:pt-20 lg:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">

          {/* Left: copy */}
          <div className="reveal">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 9, marginBottom: 24,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: C.terracotta,
            }}>
              <span style={{ display: 'block', width: 28, height: 1, background: C.terracotta }} />
              Asistente operativo para profesionales
            </div>

            <h1 style={{
              fontFamily: '"Dancing Script", cursive',
              fontWeight: 700,
              fontSize: 'clamp(54px, 7vw, 82px)',
              lineHeight: 1.08,
              color: C.inkSoft,
              margin: '0 0 24px',
            }}>
              Tu agenda,<br />tus finanzas,<br />tu escritorio.
            </h1>

            <p style={{ fontSize: 18, lineHeight: 1.7, color: C.mutedDeep, maxWidth: 480, margin: '0 0 36px' }}>
              AsistPro convierte mensajes de WhatsApp en citas confirmadas, gastos registrados y
              un panel que refleja tu operación real — sin cambiar la herramienta que ya usas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#pricing" style={{
                minHeight: 50, padding: '0 28px', borderRadius: 10,
                background: C.terracotta, color: '#fff', fontWeight: 600, fontSize: 15,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                textDecoration: 'none', boxShadow: shadow.accent, transition: 'background .18s, transform .18s',
              }}
                className="mesa-btn-accent"
              >
                Activar prueba gratuita
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <button onClick={onWhatsAppRedirect} style={{
                minHeight: 50, padding: '0 28px', borderRadius: 10,
                background: 'rgba(255,253,246,.7)', color: C.inkSoft, fontWeight: 600, fontSize: 15,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                border: `1.5px solid rgba(140,112,52,.5)`, cursor: 'pointer',
                transition: 'border-color .18s',
              }}
                className="mesa-btn-ghost"
              >
                Ver conversación real
                <MoveRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-9 flex flex-wrap gap-6" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.mutedDeep }}>
              {[
                ['✦', 'Prueba gratuita de 3 días'],
                ['✦', '+10.000 usuarios activos'],
                ['✦', 'Disponible 24/7'],
              ].map(([dot, text]) => (
                <span key={text} className="flex items-center gap-2">
                  <span style={{ color: C.terracotta, fontSize: 9 }}>{dot}</span> {text}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Mesa folder card */}
          <div className="reveal reveal-delay-2">
            <div style={{ position: 'relative', transform: 'rotate(-1.5deg)' }}>
              {/* Folder tab */}
              <div style={{
                width: 140, height: 28, marginLeft: 22,
                background: 'linear-gradient(#ECDCAC, #E2CE96)',
                borderRadius: '10px 14px 0 0',
                boxShadow: '0 -2px 6px rgba(120,95,40,.12)',
              }} />

              {/* Folder body */}
              <div style={{
                background: 'linear-gradient(160deg, #FCFAF2, #F5EFE2)',
                borderRadius: '2px 12px 14px 14px',
                border: `1px solid rgba(140,112,52,.22)`,
                boxShadow: shadow.folder,
                overflow: 'hidden',
                position: 'relative',
              }}>
                <WashiTape top={-12} left={40} width={100} rotate={-5} color={C.terracotta} />
                <WashiTape top={-10} left={200} width={82} rotate={4} color={C.violet} />
                <PaperClip top={-12} right={18} rotate={8} />

                {/* Folder header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 18,
                  padding: '28px 26px 16px',
                  borderBottom: `1px dashed #D9CDA8`,
                }}>
                  <div style={{ textAlign: 'center', lineHeight: 1 }}>
                    <div style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: 52, color: C.inkSoft, lineHeight: 1 }}>20</div>
                  </div>
                  <div style={{ borderLeft: `1px solid #E0D5B4`, paddingLeft: 16 }}>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.14em', color: C.label, textTransform: 'uppercase' }}>
                      Lunes · Junio 2026
                    </div>
                    <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, color: C.inkSoft, marginTop: 2 }}>
                      Agenda de hoy
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.mutedDeep }}>
                    6 citas
                  </div>
                </div>

                {/* Appointment rows */}
                <div>
                  {[
                    { time: '09:00', name: 'Mariana López', type: 'Consulta inicial', amount: 'Bs 250', bar: C.violet, badge: 'Confirmada', badgeBg: '#EAE5F7', badgeColor: C.violet },
                    { time: '10:30', name: 'Diego Fuentes', type: 'Seguimiento', amount: 'Bs 180', bar: C.green, badge: 'Pagada ✓', badgeBg: '#E2EDDE', badgeColor: C.green },
                    { time: '13:30', name: 'Lucía Vargas', type: 'Sesión 1:1', amount: 'Bs 220', bar: C.terracotta, badge: 'Pendiente', badgeBg: '#FAE8E2', badgeColor: C.terracotta },
                  ].map((row, i) => (
                    <div key={row.name} className="mesa-row" style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '12px 26px',
                      borderBottom: i < 2 ? `1px solid #F1EBD9` : 'none',
                    }}>
                      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#6B6560', width: 46 }}>{row.time}</div>
                      <div style={{ width: 3, height: 36, borderRadius: 2, background: row.bar, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: C.inkSoft }}>{row.name}</div>
                        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: C.muted }}>{row.type}</div>
                      </div>
                      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: C.inkSoft }}>{row.amount}</div>
                      <span style={{
                        fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 500,
                        padding: '3px 10px', borderRadius: 100,
                        background: row.badgeBg, color: row.badgeColor,
                      }}>{row.badge}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom ticket stubs */}
                <div style={{
                  display: 'flex', gap: 12, padding: '16px 26px 22px',
                  borderTop: `1px dashed #D9CDA8`,
                }}>
                  {heroStatusItems.map(([label, value]) => (
                    <div key={label} className="mesa-lift" style={{
                      position: 'relative', flex: 1,
                      background: C.paper, borderRadius: 7,
                      padding: '12px 14px',
                      boxShadow: shadow.card,
                    }}>
                      <TicketHoles />
                      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: '0.14em', color: C.label, textTransform: 'uppercase' }}>{label}</div>
                      <div style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: 15, color: C.inkSoft, marginTop: 2 }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* WhatsApp CTA strip */}
                <div style={{
                  background: 'linear-gradient(160deg, #EBDBAB, #E3D0A0)',
                  borderTop: `1px solid rgba(140,112,52,.2)`,
                  padding: '14px 26px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                }}>
                  <div>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: C.label, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                      Todo desde WhatsApp
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginTop: 2 }}>
                      Agenda, registra y consulta.
                    </div>
                  </div>
                  <button onClick={onWhatsAppRedirect} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '9px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
                    background: '#25D366', color: '#fff', fontWeight: 600, fontSize: 13,
                    boxShadow: '0 6px 16px rgba(37,211,102,.3)', transition: 'background .18s',
                  }}>
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    Abrir chat
                  </button>
                </div>
              </div>

              {/* Pencil prop */}
              <div aria-hidden="true" style={{
                position: 'absolute', top: -10, right: 48,
                width: 130, height: 13, transform: 'rotate(22deg)',
                filter: 'drop-shadow(0 6px 5px rgba(60,45,20,.22))',
                pointerEvents: 'none', zIndex: 5,
              }}>
                <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, borderTop: '6.5px solid transparent', borderBottom: '6.5px solid transparent', borderRight: '15px solid #3a322a' }} />
                <div style={{ position: 'absolute', left: 13, top: 0, width: 0, height: 0, borderTop: '6.5px solid transparent', borderBottom: '6.5px solid transparent', borderRight: '13px solid #E8C98E' }} />
                <div style={{ position: 'absolute', left: 24, top: 0, height: 13, width: 80, background: 'linear-gradient(#F2C94C, #E0B23C)' }} />
                <div style={{ position: 'absolute', left: 102, top: 0, height: 13, width: 8, background: '#b9bcc2' }} />
                <div style={{ position: 'absolute', left: 108, top: 0, height: 13, width: 14, background: '#E89A9A', borderRadius: '0 6px 6px 0' }} />
              </div>

              {/* Coffee ring stain */}
              <div aria-hidden="true" style={{
                position: 'absolute', bottom: -30, left: -24,
                width: 80, height: 80, borderRadius: '50%',
                border: '7px solid rgba(120,75,40,.12)',
                filter: 'blur(.5px)', pointerEvents: 'none', zIndex: 1,
              }} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PROOF — ticket stubs
══════════════════════════════════════════════ */
export function ProofSection() {
  return (
    <section id="proof" className="pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-14 reveal">
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14, fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.terracotta }}>
            <span style={{ display: 'block', width: 28, height: 1, background: C.terracotta }} />
            Prueba de sistema
          </div>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: C.inkSoft, margin: 0, maxWidth: 560 }}>
            Una herramienta seria no necesita parecerlo. Solo demostrarlo.
          </h2>
        </div>

        {/* Ticket stub stats */}
        <div className="flex gap-5 flex-wrap">
          {stats.map((stat, i) => {
            const rotations = [-0.6, 0.5, -0.3, 0.4];
            return (
              <div key={stat.label} className={`reveal reveal-delay-${i + 1} mesa-lift`} style={{
                position: 'relative', flex: '1 1 180px',
                background: C.paper, borderRadius: 7,
                padding: '20px 24px',
                boxShadow: shadow.card,
                transform: `rotate(${rotations[i]}deg)`,
                overflow: 'visible',
              }}>
                <TicketHoles />
                <StatCounter {...stat} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FEATURES — post-its
══════════════════════════════════════════════ */
const FEATURE_COLORS = [
  { bar: C.violet, bg: '#EAE5F7', dot: C.violet },
  { bar: C.terracotta, bg: '#FAE8E2', dot: C.terracotta },
  { bar: C.green, bg: '#E2EDDE', dot: C.green },
  { bar: C.amber, bg: '#FAF0D6', dot: C.amber },
];

export function FeaturesSection() {
  return (
    <section id="features" className="pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start mb-14">
          <div className="reveal">
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14, fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.terracotta }}>
              <span style={{ display: 'block', width: 28, height: 1, background: C.terracotta }} />
              Sistema
            </div>
            <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: C.inkSoft, margin: 0, lineHeight: 1.15 }}>
              Una capa editorial para ordenar operaciones pequeñas con claridad grande.
            </h2>
          </div>
          <div className="reveal reveal-delay-2" style={{ paddingTop: 8 }}>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: C.mutedDeep }}>
              El valor no está solo en automatizar. Está en tomar mensajes, convertirlos en
              estructura y presentar el resultado con una jerarquía que invite a decidir, no a buscar.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const fc = FEATURE_COLORS[index % FEATURE_COLORS.length];
            const rotations = [-0.5, 0.6, -0.4, 0.3];
            return (
              <div key={feature.title} className={`reveal reveal-delay-${index + 1} mesa-card`} style={{
                background: C.paper,
                borderRadius: 8,
                padding: '24px 22px',
                boxShadow: shadow.card,
                transform: `rotate(${rotations[index]}deg)`,
                position: 'relative',
                borderTop: `4px solid ${fc.bar}`,
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 8, marginBottom: 18,
                  background: fc.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: fc.bar,
                }}>
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 20, fontWeight: 700, color: C.inkSoft, margin: '0 0 10px', lineHeight: 1.2 }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.65, color: C.mutedDeep, margin: 0 }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   METHOD + TESTIMONIALS
══════════════════════════════════════════════ */
export function MethodSection() {
  return (
    <section className="pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 items-start">

          {/* Dark panel — process */}
          <div className="reveal" style={{
            background: C.ink,
            borderRadius: 16,
            padding: '36px 32px',
            boxShadow: shadow.dark,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16, fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold }}>
              <span style={{ display: 'block', width: 28, height: 1, background: C.gold }} />
              Método
            </div>
            <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 32, fontWeight: 700, color: '#F5F1E8', margin: '0 0 32px', lineHeight: 1.15 }}>
              Tres capas.<br />Un mismo flujo.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {processSteps.map(([title, copy], index) => (
                <div key={title} style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    border: `1.5px solid rgba(217,168,46,.35)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: '"JetBrains Mono", monospace', fontSize: 13, fontWeight: 500,
                    color: C.gold,
                  }}>
                    {index + 1}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 15, color: '#F5F1E8', margin: '0 0 4px' }}>{title}</p>
                    <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.6 }}>{copy}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat preview strip */}
            <div style={{
              marginTop: 32, borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 24,
            }}>
              <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: 10, padding: '12px 16px', border: '1px solid rgba(255,255,255,.08)' }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9.5, color: '#57657C', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>
                  conversación real
                </div>
                {chatMessages.slice(0, 4).map((msg, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: msg.side === 'user' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                    <div style={{
                      maxWidth: '82%', borderRadius: 12, padding: '8px 12px',
                      background: msg.side === 'user' ? C.terracotta : 'rgba(255,255,255,.08)',
                      color: msg.side === 'user' ? '#fff' : '#C5CDD9',
                      fontSize: 12, lineHeight: 1.5,
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonials — torn paper */}
          <div className="grid gap-5">
            {testimonials.map((t, index) => (
              <div key={t.name} className={`reveal reveal-delay-${index + 1}`} style={{ position: 'relative' }}>
                <PaperClip top={-8} right={20} rotate={6} />
                <div className="mesa-card" style={{
                  background: C.paper,
                  clipPath: 'polygon(0 5%,6% 0,13% 5%,20% 0,28% 5%,36% 0,44% 5%,52% 0,60% 5%,68% 0,76% 5%,84% 0,92% 5%,100% 0,100% 100%,0 100%)',
                  padding: '28px 28px 24px',
                  boxShadow: shadow.card,
                  transform: index % 2 === 0 ? 'rotate(-0.4deg)' : 'rotate(0.3deg)',
                }}>
                  <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4" style={{ color: C.gold, fill: C.gold }} aria-hidden="true" />
                    ))}
                  </div>
                  <p style={{ fontSize: 14.5, lineHeight: 1.7, color: C.mutedDeep, margin: '0 0 20px', fontStyle: 'italic' }}>
                    "{t.content}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                      background: `linear-gradient(135deg, ${C.terracotta}, ${C.violet})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: 13,
                    }}>
                      {t.initials}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14, color: C.inkSoft, margin: 0 }}>{t.name}</p>
                      <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9.5, color: C.label, textTransform: 'uppercase', letterSpacing: '0.14em', margin: '2px 0 0' }}>
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PRICING
══════════════════════════════════════════════ */
export function PricingSection({
  isAnnual, onOpenPlan, onToggleAnnual,
}: { isAnnual: boolean; onOpenPlan: (plan: PricingPlan) => void; onToggleAnnual: () => void }) {
  const pricingPlans = getPricingPlans(isAnnual);

  return (
    <section id="pricing" className="pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, marginBottom: 14, fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.terracotta }}>
            <span style={{ display: 'block', width: 28, height: 1, background: C.terracotta }} />
            Planes
            <span style={{ display: 'block', width: 28, height: 1, background: C.terracotta }} />
          </div>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: C.inkSoft, margin: '0 0 16px' }}>
            Un sistema sobrio también necesita una estructura clara de entrada.
          </h2>
          <p style={{ fontSize: 16, color: C.mutedDeep, maxWidth: 480, margin: '0 auto 28px' }}>
            Los tres planes conservan el flujo. La diferencia está en profundidad y cobertura operativa.
          </p>

          {/* Toggle */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 14,
            borderRadius: 100, border: `1.5px solid rgba(140,112,52,.35)`,
            background: 'rgba(255,253,246,.78)', padding: '8px 18px',
          }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: !isAnnual ? C.inkSoft : C.muted }}>Mensual</span>
            <button onClick={onToggleAnnual} style={{
              position: 'relative', display: 'inline-flex', height: 24, width: 44,
              borderRadius: 100, border: 'none', cursor: 'pointer',
              background: isAnnual ? C.ink : 'rgba(26,24,22,.15)',
              transition: 'background .2s',
            }}>
              <span style={{
                position: 'absolute', top: 4, width: 16, height: 16,
                borderRadius: '50%', background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,.2)',
                left: isAnnual ? 24 : 4,
                transition: 'left .2s',
              }} />
            </button>
            <span style={{ fontSize: 13, fontWeight: 500, color: isAnnual ? C.inkSoft : C.muted }}>Anual</span>
            {isAnnual && (
              <span style={{
                borderRadius: 100, background: '#E2EDDE', color: C.green, border: `1px solid rgba(84,117,82,.25)`,
                padding: '3px 12px', fontSize: 11, fontWeight: 600,
              }}>
                Mejor relación anual
              </span>
            )}
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid lg:grid-cols-3 gap-6">
          {pricingPlans.map((plan, index) => {
            const isPopular = !!plan.popular;
            const isPremium = plan.name === 'Premium';
            const cardBg = isPopular ? C.ink : isPremium ? `linear-gradient(160deg, ${C.manila}, ${C.manilaDeep})` : C.paper;
            const textColor = isPopular ? '#F5F1E8' : C.inkSoft;
            const secondaryColor = isPopular ? C.muted : C.mutedDeep;

            return (
              <div key={plan.name} className={`relative reveal reveal-delay-${index + 1}`} style={{
                borderRadius: 16,
                padding: '32px 28px',
                background: cardBg,
                border: isPopular
                  ? `1px solid rgba(217,168,46,.3)`
                  : isPremium
                  ? `1px solid rgba(140,112,52,.25)`
                  : `1px solid rgba(140,112,52,.2)`,
                boxShadow: isPopular ? shadow.dark : shadow.card,
              }}>
                {/* Folder tab on popular */}
                {isPopular && (
                  <div style={{
                    position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)',
                  }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      background: C.gold, color: '#1a1208', padding: '5px 16px', borderRadius: 100,
                      fontSize: 10, fontWeight: 700, fontFamily: '"JetBrains Mono", monospace',
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      boxShadow: '0 5px 14px rgba(217,168,46,.4)',
                    }}>
                      <Zap className="w-3 h-3" aria-hidden="true" />
                      Selección editorial
                    </span>
                  </div>
                )}

                {/* Washi tape on starter */}
                {!isPopular && !isPremium && (
                  <WashiTape top={-10} left={20} width={70} rotate={-3} color={C.violet} />
                )}

                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: isPopular ? C.label : C.label, margin: '0 0 8px' }}>
                    {plan.name}
                  </p>
                  <p style={{ fontSize: 13, color: secondaryColor, margin: 0 }}>{plan.description}</p>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontFamily: '"Playfair Display", serif', fontSize: 36, fontWeight: 700, color: textColor }}>
                      {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span style={{ fontSize: 13, color: secondaryColor }}>{plan.period}</span>
                  </div>
                  {plan.savings && isAnnual && (
                    <p style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: isPopular ? C.gold : C.green }}>
                      {plan.savings}
                    </p>
                  )}
                  <p style={{ marginTop: 4, fontSize: 12, color: secondaryColor }}>Prueba gratuita de 3 días</p>
                </div>

                <div style={{ marginBottom: 24 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                        background: isPopular ? 'rgba(217,168,46,.18)' : '#E2EDDE',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isPopular ? C.gold : C.green,
                      }}>
                        <Check className="w-3 h-3" aria-hidden="true" />
                      </div>
                      <span style={{ fontSize: 13.5, color: textColor }}>{f}</span>
                    </div>
                  ))}
                  {plan.notIncluded.length > 0 && (
                    <>
                      <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: secondaryColor, margin: '14px 0 10px' }}>
                        No incluye
                      </p>
                      {plan.notIncluded.map(f => (
                        <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                          <X className="w-4 h-4" style={{ flexShrink: 0, marginTop: 2, color: secondaryColor }} aria-hidden="true" />
                          <span style={{ fontSize: 13, color: secondaryColor }}>{f}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <button onClick={() => onOpenPlan(plan)} style={{
                  width: '100%', minHeight: 46, borderRadius: 10, cursor: 'pointer',
                  fontWeight: 600, fontSize: 14, fontFamily: '"DM Sans", system-ui, sans-serif',
                  transition: 'background .18s, transform .18s',
                  background: isPopular ? C.gold : isPremium ? C.ink : C.terracotta,
                  color: isPopular ? '#1a1208' : '#fff',
                  border: 'none',
                  boxShadow: isPopular ? '0 6px 16px rgba(217,168,46,.35)' : shadow.accent,
                }}
                  className={isPopular ? '' : 'mesa-btn-accent'}
                >
                  Abrir plan
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   CLOSING
══════════════════════════════════════════════ */
export function ClosingSection({
  onWhatsAppRedirect,
}: { onWhatsAppRedirect: () => void }) {
  return (
    <section className="pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal" style={{
          background: C.ink,
          borderRadius: 20,
          padding: 'clamp(32px, 5vw, 52px)',
          boxShadow: shadow.dark,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative coffee ring */}
          <div aria-hidden="true" style={{
            position: 'absolute', right: 80, top: 40,
            width: 140, height: 140, borderRadius: '50%',
            border: '9px solid rgba(217,168,46,.08)',
            filter: 'blur(.5px)', pointerEvents: 'none',
          }} />

          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 18, fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold }}>
                <span style={{ display: 'block', width: 28, height: 1, background: C.gold }} />
                Cierre
              </div>
              <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(28px,4vw,46px)', fontWeight: 700, color: '#F5F1E8', margin: '0 0 18px', lineHeight: 1.15 }}>
                Si el producto organiza tu operación, la interfaz tiene que demostrarlo desde el primer segundo.
              </h2>
              <p style={{ fontSize: 16, color: C.muted, margin: 0 }}>
                AsistPro ya resolvía el flujo. Ahora también comunica criterio, estructura y confianza.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <a href="#pricing" style={{
                minHeight: 50, padding: '0 28px', borderRadius: 10, textDecoration: 'none',
                background: C.gold, color: '#1a1208', fontWeight: 700, fontSize: 15,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 6px 18px rgba(217,168,46,.35)', transition: 'background .18s',
              }}>
                Comenzar ahora
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <button onClick={onWhatsAppRedirect} style={{
                minHeight: 50, padding: '0 28px', borderRadius: 10, cursor: 'pointer',
                background: 'transparent', color: '#F5F1E8', fontWeight: 600, fontSize: 15,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                border: `1.5px solid rgba(255,255,255,.14)`, transition: 'border-color .18s',
              }}
                className="mesa-btn-ghost"
              >
                Hablar con ventas
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
              </button>
              <p style={{ fontSize: 13, color: '#57657C', margin: '2px 0 0' }}>
                Sin tarjeta obligatoria. Cancelación simple.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════ */
export function SiteFooter() {
  return (
    <footer id="contact" style={{
      borderTop: `1px solid rgba(140,112,52,.2)`,
      background: 'rgba(217,207,187,.42)',
      paddingTop: 56, paddingBottom: 56,
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.3fr_0.9fr_0.9fr_0.9fr] gap-10 mb-10">
          <div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ display: 'block', fontFamily: '"Playfair Display", Georgia, serif', fontSize: 26, fontWeight: 700, color: C.inkSoft, lineHeight: 1 }}>
                AsistPro<span style={{ color: C.terracotta }}>.</span>
              </span>
              <span style={{ display: 'block', fontFamily: '"JetBrains Mono", monospace', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.label, marginTop: 3 }}>
                Asistente operativo
              </span>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: C.mutedDeep, maxWidth: 280 }}>
              Un asistente conversacional con una capa visual más precisa para agenda,
              recordatorios y finanzas.
            </p>
          </div>

          {footerColumns.map(column => {
            const Icon = column.icon;
            return (
              <div key={column.title}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: C.inkSoft }}>
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <h3 style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0 }}>
                    {column.title}
                  </h3>
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {column.links.map(link => (
                    <li key={link} style={{ marginBottom: 10 }}>
                      <a href="#" style={{
                        fontSize: 13.5, color: C.mutedDeep, textDecoration: 'none',
                        minHeight: 44, display: 'flex', alignItems: 'center',
                        transition: 'color .18s',
                      }}
                        onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = C.terracotta)}
                        onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = C.mutedDeep)}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div style={{
          borderTop: `1px solid rgba(140,112,52,.18)`,
          paddingTop: 22,
          display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between',
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          letterSpacing: '0.18em', textTransform: 'uppercase', color: C.label,
        }}>
          <p style={{ margin: 0 }}>© 2026 AsistPro</p>
          <p style={{ margin: 0 }}>Asistencia conversacional para operación real</p>
        </div>
      </div>
    </footer>
  );
}
