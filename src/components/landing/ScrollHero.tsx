import { useEffect, useRef, useState } from 'react';
import { Check, ChevronRight, MessageCircle } from 'lucide-react';

/* ────────────────────────────────────────────────────────────
   Hero scroll-driven: el caos de herramientas colapsa en un
   único punto (AsistPro) y se ordena en un chat resuelto.

   Todo el movimiento se deriva de un solo valor de progreso
   `p` (0→1) con una única familia de easing (smoothstep), para
   que la coreografía se sienta orquestada y consistente — no
   una suma de efectos sueltos.
──────────────────────────────────────────────────────────── */

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
/** Aparece dentro de [inA,inB] y desaparece dentro de [outA,outB]. */
const windowOpacity = (p: number, inA: number, inB: number, outA: number, outB: number) =>
  clamp01(smoothstep(inA, inB, p) - smoothstep(outA, outB, p));

type Chaos = { label: string; img: string; angle: number; radius: number; spin: number; stagger: number };

const CHAOS_RAW = [
  { label: 'Planillas de Excel', img: 'excel.png' },
  { label: 'Calendario físico', img: 'calendario-fisico.png' },
  { label: 'Archivos sueltos', img: 'archivos-sueltos.png' },
  { label: 'Pizarra de tareas', img: 'pizarra.png' },
  { label: 'Agenda de papel', img: 'agenda-de-papel.png' },
  { label: 'Apps que no se hablan', img: 'apps-que-no-se-hablan.png' },
  { label: 'Emails sin leer', img: 'correo.png' },
  { label: 'Notas post-it', img: 'postits.png' },
  { label: 'Alarmas del celular', img: 'reloj-alarma.png' },
];

// Reparto radial parejo (elipse) + parámetros de movimiento propios por tarjeta.
const CHAOS: Chaos[] = CHAOS_RAW.map((it, i, arr) => {
  const angle = (i / arr.length) * Math.PI * 2 - Math.PI / 2;
  const yScale = Math.sin(angle) > 0 ? 0.6 : 0.8; // menos espacio abajo (vive el scroll cue)
  return {
    ...it,
    angle,
    radius: 42,
    // giro extra al colapsar (momentum) — alterna sentido para dar vida
    spin: (i % 2 === 0 ? -1 : 1) * (90 + (i % 3) * 46),
    // arranque escalonado: cada tarjeta cae hacia el centro en un instante distinto
    stagger: (i % 5) * 0.028,
    _yScale: yScale,
  } as Chaos & { _yScale: number };
});

function useScrollProgress(ref: React.RefObject<HTMLElement>) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let ticking = false;
    const compute = () => {
      ticking = false;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const next = total > 0 ? clamp01(-rect.top / total) : 0;
      setP((prev) => (Math.abs(prev - next) > 0.0006 ? next : prev));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref]);
  return p;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

/* ── Chat resuelto (composición final) ─────────────────────── */
const RESOLVED = [
  { side: 'user', text: 'Recordame la reunión con el cliente mañana 15:00', time: '14:32' },
  { side: 'bot', text: '✅ Agendada para mañana 15:00, con recordatorio 30 min antes.', time: '14:32' },
  { side: 'user', text: 'Anotá que gasté $2.500 en el almuerzo', time: '14:35' },
  { side: 'bot', text: '💰 Registrado en «Alimentación». Vas al 65% del presupuesto.', time: '14:35' },
];

function ResolvedComposition({
  style,
  onWhatsApp,
}: {
  style: React.CSSProperties;
  onWhatsApp: () => void;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        width: 'min(94vw, 900px)',
        ...style,
      }}
    >
      <h2
        className="font-display"
        style={{
          textAlign: 'center',
          fontWeight: 800,
          fontSize: 'clamp(26px, 4vw, 44px)',
          letterSpacing: '-0.02em',
          margin: '0 0 clamp(20px, 3vw, 32px)',
          lineHeight: 1.1,
        }}
      >
        Un chat. <span style={{ color: 'var(--accent-dark)' }}>Todo resuelto.</span>
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
          gap: 'clamp(18px, 4vw, 48px)',
          alignItems: 'center',
        }}
        className="hero-final-grid"
      >
        {/* Phone / chat card */}
        <div
          style={{
            justifySelf: 'end',
            width: 'min(300px, 82vw)',
            borderRadius: 22,
            overflow: 'hidden',
            background: '#fff',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              background: '#075e54',
              color: '#fff',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#fff',
              }}
            >
              A
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>AsistPro</div>
              <div style={{ fontSize: 11.5, opacity: 0.85, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{ width: 6, height: 6, borderRadius: '50%', background: '#57e0a8' }}
                  className="animate-glow-pulse"
                />
                en línea
              </div>
            </div>
          </div>
          <div
            style={{
              padding: '14px 12px',
              minHeight: 250,
              display: 'flex',
              flexDirection: 'column',
              gap: 9,
              background: '#efeae2',
            }}
          >
            {RESOLVED.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.side === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '84%',
                  padding: '8px 11px',
                  borderRadius: 13,
                  fontSize: 12.5,
                  lineHeight: 1.5,
                  boxShadow: 'var(--shadow-sm)',
                  background: m.side === 'user' ? '#dcf8c6' : '#fff',
                  color: '#1f2937',
                }}
              >
                {m.text}
                <div style={{ fontSize: 9.5, opacity: 0.55, marginTop: 3, textAlign: 'right', fontFamily: '"JetBrains Mono", monospace' }}>
                  {m.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Result cards + CTA */}
        <div style={{ justifySelf: 'start', width: 'min(300px, 82vw)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            'Reunión agendada para mañana, con recordatorio incluido.',
            'Gasto de $2.500 registrado en «Alimentación».',
          ].map((t) => (
            <div
              key={t}
              style={{
                display: 'flex',
                gap: 11,
                alignItems: 'center',
                padding: '15px 17px',
                borderRadius: 14,
                background: '#fff',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'var(--accent-light)',
                  color: 'var(--accent-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
              <span style={{ fontSize: 13.5, lineHeight: 1.4, color: 'var(--text-secondary)' }}>{t}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
            <a
              href="#pricing"
              className="u-press"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '13px 22px',
                borderRadius: 11,
                background: 'var(--accent-dark)',
                color: '#fff',
                fontWeight: 600,
                fontSize: 14,
                textDecoration: 'none',
                boxShadow: 'var(--shadow-accent)',
              }}
            >
              Comenzar gratis
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <button
              onClick={onWhatsApp}
              className="u-press"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '13px 20px',
                borderRadius: 11,
                border: '1.5px solid var(--border)',
                background: 'rgba(255,255,255,0.7)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              Ver demo
            </button>
          </div>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 4, fontSize: 12, color: 'var(--text-muted)', fontFamily: '"JetBrains Mono", monospace' }}>
            <span>3 días gratis</span>
            <span>+10.000 usuarios</span>
            <span>24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScrollHero({ onWhatsApp }: { onWhatsApp: () => void }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(heroRef);
  const reduced = usePrefersReducedMotion();

  // Si el usuario prefiere menos movimiento, mostramos la composición final
  // resuelta, sin coreografía de scroll ni sección alta.
  if (reduced) {
    return (
      <section className="relative" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ position: 'relative', minHeight: 520 }}>
            <ResolvedComposition style={{ opacity: 1 }} onWhatsApp={onWhatsApp} />
          </div>
        </div>
      </section>
    );
  }

  // ── Fases derivadas de p ──
  const singGrow = smoothstep(0.34, 0.6, p); // el punto crece mientras cae el caos
  const singBloom = smoothstep(0.58, 0.72, p); // florece y se disuelve
  const singOpacity = clamp01(smoothstep(0.24, 0.36, p) - smoothstep(0.62, 0.74, p));
  const singScale = 0.18 + singGrow * 1.1 + singBloom * 2.6;

  const ringT = smoothstep(0.5, 0.7, p); // anillo de choque en el colapso
  const finalIn = smoothstep(0.68, 0.9, p);

  return (
    <section aria-label="AsistPro ordena tu día" ref={heroRef} style={{ position: 'relative', height: '320vh' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Halo de fondo que respira con el progreso */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '80vmin',
            height: '80vmin',
            transform: `translate(-50%,-50%) scale(${0.6 + singGrow * 0.6})`,
            background: 'radial-gradient(circle, rgba(249,115,22,0.16), transparent 62%)',
            opacity: 0.3 + singGrow * 0.5,
            pointerEvents: 'none',
          }}
        />

        {/* Titular fase 1 / fase 2 */}
        <h1
          className="font-display"
          style={{
            position: 'absolute',
            top: '14%',
            left: '50%',
            transform: 'translateX(-50%)',
            margin: 0,
            textAlign: 'center',
            maxWidth: '82vw',
            fontWeight: 800,
            fontSize: 'clamp(28px, 5vw, 56px)',
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            opacity: 1 - smoothstep(0.26, 0.38, p),
            pointerEvents: 'none',
          }}
        >
          Tu día vive atrapado en <span style={{ color: 'var(--accent-dark)' }}>mil herramientas</span>
        </h1>
        <h1
          className="font-display"
          style={{
            position: 'absolute',
            top: '14%',
            left: '50%',
            transform: 'translateX(-50%)',
            margin: 0,
            textAlign: 'center',
            maxWidth: '78vw',
            fontWeight: 800,
            fontSize: 'clamp(28px, 5vw, 56px)',
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            opacity: windowOpacity(p, 0.34, 0.46, 0.58, 0.68),
            pointerEvents: 'none',
          }}
        >
          Todo ese caos se ordena en <span style={{ color: 'var(--accent-dark)' }}>un solo lugar</span>
        </h1>

        {/* Caos: tarjetas que espiralan hacia el centro */}
        {CHAOS.map((c) => {
          const pull = smoothstep(0.04 + c.stagger, 0.5 + c.stagger, p);
          const r = c.radius * (1 - pull);
          const x = Math.cos(c.angle) * r;
          const y = Math.sin(c.angle) * r * (c as Chaos & { _yScale: number })._yScale;
          const baseRot = (Math.sin(c.angle * 3) * 8);
          const rot = baseRot * (1 - pull) + c.spin * pull;
          const scale = 1 - pull * 0.88;
          const opacity = clamp01(1 - smoothstep(0.72, 1, pull)) * (1 - smoothstep(0.62, 0.72, p));
          return (
            <div
              key={c.label}
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%,-50%) translate(${x}vmin, ${y}vmin) rotate(${rot}deg) scale(${scale})`,
                opacity,
                pointerEvents: 'none',
                willChange: 'transform, opacity',
              }}
            >
              <div
                style={{
                  width: 116,
                  padding: '10px 12px',
                  textAlign: 'center',
                  borderRadius: 12,
                  background: '#fff',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <img src={`/landing/chaos/${c.img}`} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                <div className="font-display" style={{ fontWeight: 600, fontSize: 11.5, lineHeight: 1.25, color: 'var(--text-primary)' }}>
                  {c.label}
                </div>
              </div>
            </div>
          );
        })}

        {/* Anillo de choque en el colapso */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 120,
            height: 120,
            marginLeft: -60,
            marginTop: -60,
            borderRadius: '50%',
            border: '2px solid var(--accent)',
            transform: `scale(${0.4 + ringT * 3.2})`,
            opacity: (1 - ringT) * 0.7,
            pointerEvents: 'none',
          }}
        />

        {/* Singularidad: el punto AsistPro */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 96,
            height: 96,
            marginLeft: -48,
            marginTop: -48,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%, #ffb27a, var(--accent-dark))',
            boxShadow: '0 0 60px rgba(249,115,22,0.55), 0 20px 50px rgba(234,88,12,0.4)',
            transform: `scale(${singScale})`,
            opacity: singOpacity,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
          }}
        />

        {/* Composición final resuelta */}
        <ResolvedComposition
          style={{
            opacity: finalIn,
            transform: `translate(-50%,-50%) translateY(${(1 - finalIn) * 36}px)`,
            pointerEvents: finalIn > 0.6 ? 'auto' : 'none',
          }}
          onWhatsApp={onWhatsApp}
        />

        {/* Scroll cue */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 24,
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            opacity: 1 - smoothstep(0, 0.05, p),
            pointerEvents: 'none',
          }}
        >
          Desplazá para ver la transformación
          <span className="animate-float" style={{ fontSize: 16, color: 'var(--accent-dark)' }}>↓</span>
        </div>
      </div>
    </section>
  );
}
