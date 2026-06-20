import { useCallback, useEffect, useRef } from 'react';

/**
 * Porta el drag de los post-its del prototipo Escritorio.dc.html.
 * Cada nota recuerda su desplazamiento {x,y} en localStorage('om_notes'),
 * de modo que el tablero de corcho conserva el orden entre sesiones.
 */
const STORAGE_KEY = 'om_notes';
const REST_SHADOW = '0 10px 20px rgba(70,50,20,.28)';
const DRAG_SHADOW = '0 24px 38px rgba(60,40,16,.34)';

type Delta = { x: number; y: number };

function readDeltas(): Record<string, Delta> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function useDraggableNotes() {
  const deltas = useRef<Record<string, Delta>>({});
  const z = useRef(30);

  const apply = useCallback((node: HTMLElement, x: number, y: number, grabbing: boolean) => {
    const rot = parseFloat(node.getAttribute('data-rot') || '0');
    node.style.transform =
      `translate(${x}px,${y}px) rotate(${rot}deg)` + (grabbing ? ' scale(1.05)' : '');
  }, []);

  // Restaura posiciones guardadas al montar.
  const register = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;
      const id = node.getAttribute('data-id');
      if (!id) return;
      const d = deltas.current[id];
      if (d) apply(node, d.x, d.y, false);
    },
    [apply],
  );

  useEffect(() => {
    deltas.current = readDeltas();
  }, []);

  const startDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      const node = e.currentTarget;
      const id = node.getAttribute('data-id') || '';
      const cur = deltas.current[id] || { x: 0, y: 0 };
      const sx = e.clientX;
      const sy = e.clientY;
      let last = cur;

      node.style.zIndex = String(++z.current);
      node.style.cursor = 'grabbing';
      node.style.boxShadow = DRAG_SHADOW;
      apply(node, cur.x, cur.y, true);

      const move = (ev: PointerEvent) => {
        last = { x: cur.x + (ev.clientX - sx), y: cur.y + (ev.clientY - sy) };
        apply(node, last.x, last.y, true);
      };
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        deltas.current[id] = last;
        apply(node, last.x, last.y, false);
        node.style.cursor = 'grab';
        node.style.boxShadow = REST_SHADOW;
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(deltas.current));
        } catch {
          /* almacenamiento no disponible: posiciones sólo en memoria */
        }
      };

      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      e.preventDefault();
    },
    [apply],
  );

  return { register, startDrag };
}
