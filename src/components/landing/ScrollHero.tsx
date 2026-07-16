import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Check, ChevronRight, MessageCircle } from 'lucide-react';

/* ────────────────────────────────────────────────────────────
   Hero: el caos de herramientas colapsa en un único punto
   (AsistPro) y se ordena en un chat resuelto.

   Animación *autoejecutable al cargar* (un page-load orquestado),
   no scroll-jacking: el estado de reposo es la composición
   resuelta — contenido y CTA siempre visibles y funcionales,
   incluso sin JS o con `prefers-reduced-motion`. El intro sólo
   la realza.

   Todo el movimiento se deriva de un único valor `t` (0→1) con
   una sola familia de easing (smoothstep), para que la
   coreografía se sienta orquestada y consistente.
──────────────────────────────────────────────────────────── */

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
/** Aparece dentro de [inA,inB] y desaparece dentro de [outA,outB]. */
const windowOpacity = (p: number, inA: number, inB: number, outA: number, outB: number) =>
  clamp01(smoothstep(inA, inB, p) - smoothstep(outA, outB, p));

type Chaos = { label: string; img: string; size: number; angle: number; yScale: number; spin: number; stagger: number };

// Tamaño base variable por objeto (px): rompe la uniformidad y da profundidad
// —los objetos más grandes leen como "más cerca". Emparejado a cada asset.
const CHAOS_RAW = [
  { label: 'Planillas de Excel', img: 'excel.png', size: 124 },
  { label: 'Calendario físico', img: 'calendario-fisico.png', size: 96 },
  { label: 'Archivos sueltos', img: 'archivos-sueltos.png', size: 78 },
  { label: 'Pizarra de tareas', img: 'pizarra.png', size: 132 },
  { label: 'Agenda de papel', img: 'agenda-de-papel.png', size: 88 },
  { label: 'Apps que no se hablan', img: 'apps-que-no-se-hablan.png', size: 108 },
  { label: 'Emails sin leer', img: 'correo.png', size: 74 },
  { label: 'Notas post-it', img: 'postits.png', size: 100 },
  { label: 'Alarmas del celular', img: 'reloj-alarma.png', size: 84 },
];

const CHAOS: Chaos[] = CHAOS_RAW.map((it, i, arr) => {
  const angle = (i / arr.length) * Math.PI * 2 - Math.PI / 2;
  return {
    ...it,
    angle,
    yScale: Math.sin(angle) > 0 ? 0.72 : 0.86,
    spin: (i % 2 === 0 ? -1 : 1) * (90 + (i % 3) * 46), // giro extra al colapsar (momentum)
    stagger: (i % 5) * 0.03, // arranque escalonado por objeto
  };
});

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

/** Reproduce el intro una vez al montar. Estado de reposo = t:1 (resuelto). */
function useIntroTimeline(durationMs: number): number {
  const [t, setT] = useState(1); // SSR / sin-JS / reposo: composición resuelta visible
  const raf = useRef<number>();

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; // sin motion: queda resuelto
    // Sin guard `started`: en React StrictMode (next dev) el efecto corre
    // montar→limpiar→remontar; un ref que sobrevive dejaría la animación
    // cancelada por el cleanup y nunca reiniciada. Cada montaje reinicia limpio.
    setT(0);
    const begin = performance.now() + 220; // pequeña espera antes de arrancar
    const tick = (now: number) => {
      const elapsed = now - begin;
      if (elapsed <= 0) {
        raf.current = requestAnimationFrame(tick);
        return;
      }
      const next = clamp01(elapsed / durationMs);
      setT(next);
      if (next < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [durationMs]);

  return t;
}

/* ── Chat resuelto (composición final, estado de reposo) ───── */
const RESOLVED = [
  { side: 'user', text: 'Recordame la reunión con el cliente mañana 15:00', time: '14:32' },
  { side: 'bot', text: '✅ Agendada para mañana 15:00, con recordatorio 30 min antes.', time: '14:32' },
  { side: 'user', text: 'Anotá que gasté $2.500 en el almuerzo', time: '14:35' },
  { side: 'bot', text: '💰 Registrado en «Alimentación». Vas al 65% del presupuesto.', time: '14:35' },
];

function ResolvedComposition({
  style,
  interactive,
  onWhatsApp,
}: {
  style?: React.CSSProperties;
  interactive: boolean;
  onWhatsApp: () => void;
}) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 940,
        margin: '0 auto',
        pointerEvents: interactive ? 'auto' : 'none',
        ...style,
      }}
    >
      <h1
        className="font-display"
        style={{
          textAlign: 'center',
          fontWeight: 800,
          fontSize: 'clamp(30px, 5vw, 60px)',
          letterSpacing: '-0.03em',
          textWrap: 'balance',
          margin: '0 0 clamp(24px, 4vw, 40px)',
          lineHeight: 1.04,
        }}
      >
        Un chat. <span style={{ color: 'var(--accent-dark)' }}>Todo resuelto.</span>
      </h1>

      <div
        className="hero-final-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
          gap: 'clamp(20px, 4vw, 52px)',
          alignItems: 'center',
        }}
      >
        {/* Chat card */}
        <div
          style={{
            justifySelf: 'end',
            width: 'min(320px, 100%)',
            borderRadius: 22,
            overflow: 'hidden',
            background: '#fff',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#075e54', color: '#fff' }}>
            <div
              style={{
                width: 34, height: 34, borderRadius: '50%', background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff',
              }}
            >
              A
            </div>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 600 }}>AsistPro</div>
              <div style={{ fontSize: 11.5, opacity: 0.85, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#57e0a8' }} />
                en línea
              </div>
            </div>
          </div>
          <div style={{ padding: '14px 12px', minHeight: 258, display: 'flex', flexDirection: 'column', gap: 9, background: '#efeae2' }}>
            {RESOLVED.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.side === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '84%', padding: '9px 12px', borderRadius: 14,
                  fontSize: 12.5, lineHeight: 1.5, boxShadow: 'var(--shadow-sm)',
                  background: m.side === 'user' ? '#dcf8c6' : '#fff', color: '#1f2937',
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

        {/* Resultados + CTA */}
        <div style={{ justifySelf: 'start', width: 'min(320px, 100%)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            'Reunión agendada para mañana, con recordatorio incluido.',
            'Gasto de $2.500 registrado en «Alimentación».',
          ].map((t) => (
            <div
              key={t}
              style={{
                display: 'flex', gap: 12, alignItems: 'center', padding: '15px 17px', borderRadius: 14,
                background: '#fff', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
              }}
            >
              <span
                style={{
                  flexShrink: 0, width: 26, height: 26, borderRadius: '50%',
                  background: 'var(--accent-light)', color: 'var(--accent-dark)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Check className="w-4 h-4" aria-hidden="true" />
              </span>
              <span style={{ fontSize: 14, lineHeight: 1.4, color: 'var(--text-secondary)' }}>{t}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
            <a
              href="#pricing"
              className="u-press"
              tabIndex={interactive ? 0 : -1}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7, padding: '14px 24px', borderRadius: 11,
                background: 'var(--accent-dark)', color: '#fff', fontWeight: 600, fontSize: 14.5,
                textDecoration: 'none', boxShadow: 'var(--shadow-accent)',
              }}
            >
              Comenzar gratis
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <button
              onClick={onWhatsApp}
              className="u-press"
              tabIndex={interactive ? 0 : -1}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7, padding: '14px 20px', borderRadius: 11,
                border: '1.5px solid var(--border)', background: 'rgba(255,255,255,0.7)',
                color: 'var(--text-primary)', fontWeight: 600, fontSize: 14.5, cursor: 'pointer',
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
  const reduced = usePrefersReducedMotion();
  const t = useIntroTimeline(2600);

  // Estado resuelto (reposo o reduced-motion): render simple y centrado, sin capas de animación.
  if (reduced || t >= 1) {
    return (
      <section aria-label="AsistPro ordena tu día" style={{ position: 'relative', padding: 'clamp(48px, 8vh, 96px) 16px' }}>
        <ResolvedComposition interactive onWhatsApp={onWhatsApp} />
      </section>
    );
  }

  // ── Intro en curso: capas derivadas de t ──
  const singGrow = smoothstep(0.34, 0.6, t);
  const singBloom = smoothstep(0.58, 0.72, t);
  const singOpacity = clamp01(smoothstep(0.24, 0.36, t) - smoothstep(0.62, 0.74, t));
  const singScale = 0.18 + singGrow * 1.1 + singBloom * 2.6;
  const ringT = smoothstep(0.5, 0.7, t);
  const finalIn = smoothstep(0.68, 0.98, t);

  return (
    <section
      aria-label="AsistPro ordena tu día"
      style={{
        position: 'relative',
        minHeight: 'clamp(600px, 92vh, 900px)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Halo de fondo */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', left: '50%', top: '50%',
          width: '78vmin', height: '78vmin',
          transform: `translate(-50%,-50%) scale(${0.6 + singGrow * 0.6})`,
          background: 'radial-gradient(circle, rgba(249,115,22,0.16), transparent 62%)',
          opacity: 0.3 + singGrow * 0.5, pointerEvents: 'none',
        }}
      />

      {/* Titular fase 1 / fase 2 */}
      <h1
        className="font-display"
        style={{
          position: 'absolute', top: '9%', left: '50%', transform: 'translateX(-50%)', margin: 0,
          textAlign: 'center', maxWidth: '82vw', fontWeight: 800,
          fontSize: 'clamp(28px, 5vw, 56px)', lineHeight: 1.06, letterSpacing: '-0.03em', textWrap: 'balance',
          opacity: 1 - smoothstep(0.24, 0.36, t), pointerEvents: 'none',
        }}
      >
        Tu día vive atrapado en <span style={{ color: 'var(--accent-dark)' }}>mil herramientas</span>
      </h1>
      <h1
        className="font-display"
        style={{
          position: 'absolute', top: '9%', left: '50%', transform: 'translateX(-50%)', margin: 0,
          textAlign: 'center', maxWidth: '80vw', fontWeight: 800,
          fontSize: 'clamp(28px, 5vw, 56px)', lineHeight: 1.06, letterSpacing: '-0.03em', textWrap: 'balance',
          opacity: windowOpacity(t, 0.34, 0.46, 0.6, 0.72), pointerEvents: 'none',
        }}
      >
        Todo ese caos se ordena en <span style={{ color: 'var(--accent-dark)' }}>un solo lugar</span>
      </h1>

      {/* Caos: tarjetas que espiralan hacia el centro */}
      {CHAOS.map((c) => {
        const pull = smoothstep(0.04 + c.stagger, 0.5 + c.stagger, t);
        const r = 30 * (1 - pull);
        const x = Math.cos(c.angle) * r;
        const y = Math.sin(c.angle) * r * c.yScale;
        const baseRot = Math.sin(c.angle * 3) * 8;
        const rot = baseRot * (1 - pull) + c.spin * pull;
        const scale = 1 - pull * 0.88;
        const opacity = clamp01(1 - smoothstep(0.72, 1, pull)) * (1 - smoothstep(0.62, 0.72, t));
        return (
          <img
            key={c.label}
            src={`/landing/chaos/${c.img}`}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute', left: '50%', top: '58%',
              width: c.size, height: 'auto', // respeta el aspect ratio real de cada PNG
              transform: `translate(-50%,-50%) translate(${x}vmin, ${y}vmin) rotate(${rot}deg) scale(${scale})`,
              transformOrigin: 'center',
              opacity, pointerEvents: 'none', willChange: 'transform, opacity',
              filter: 'drop-shadow(0 10px 18px rgba(15,23,42,0.14))',
            }}
          />
        );
      })}

      {/* Anillo de choque */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', left: '50%', top: '58%', width: 120, height: 120, marginLeft: -60, marginTop: -60,
          borderRadius: '50%', border: '2px solid var(--accent)',
          transform: `scale(${0.4 + ringT * 3.2})`, opacity: (1 - ringT) * 0.7, pointerEvents: 'none',
        }}
      />

      {/* Singularidad */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', left: '50%', top: '58%', width: 96, height: 96, marginLeft: -48, marginTop: -48,
          borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #ffb27a, var(--accent-dark))',
          boxShadow: '0 0 60px rgba(249,115,22,0.55), 0 20px 50px rgba(234,88,12,0.4)',
          transform: `scale(${singScale})`, opacity: singOpacity, pointerEvents: 'none', willChange: 'transform, opacity',
        }}
      />

      {/* Composición final emergiendo */}
      <div
        style={{
          position: 'absolute', left: 0, right: 0, top: '50%',
          transform: `translateY(-50%) translateY(${(1 - finalIn) * 30}px)`,
          opacity: finalIn,
        }}
      >
        <ResolvedComposition interactive={finalIn > 0.6} onWhatsApp={onWhatsApp} />
      </div>
    </section>
  );
}
