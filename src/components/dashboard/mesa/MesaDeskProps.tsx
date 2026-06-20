/** Props decorativos del escritorio: café helado y planta. Puramente estéticos. */
export function MesaDeskProps() {
  return (
    <>
      {/* café helado */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 14, right: 34, width: 62, height: 96, zIndex: 6, pointerEvents: 'none', filter: 'drop-shadow(0 10px 10px rgba(60,40,20,.22))' }}>
        <div style={{ position: 'absolute', left: 11, top: -30, width: 7, height: 96, background: 'linear-gradient(#C94E2C,#a83e22)', borderRadius: 4, transform: 'rotate(13deg)', transformOrigin: 'bottom' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 62, height: 84, borderRadius: '8px 8px 16px 16px', background: 'linear-gradient(180deg,#cdb089 0 38%,#7c4a26 38% 100%)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 12, left: 7, width: 15, height: 15, background: 'rgba(255,255,255,.55)', borderRadius: 4, transform: 'rotate(18deg)' }} />
          <div style={{ position: 'absolute', top: 26, left: 26, width: 14, height: 14, background: 'rgba(255,255,255,.5)', borderRadius: 4, transform: 'rotate(-12deg)' }} />
          <div style={{ position: 'absolute', top: 8, left: 32, width: 12, height: 12, background: 'rgba(255,255,255,.45)', borderRadius: 4, transform: 'rotate(28deg)' }} />
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 62, height: 84, borderRadius: '8px 8px 16px 16px', background: 'linear-gradient(100deg,rgba(255,255,255,.42) 0 14%,rgba(255,255,255,0) 30%,rgba(255,255,255,0) 78%,rgba(255,255,255,.25) 100%)', border: '1.5px solid rgba(255,255,255,.45)' }} />
      </div>

      {/* planta */}
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 24, right: 46, width: 70, height: 96, zIndex: 6, pointerEvents: 'none', filter: 'drop-shadow(0 9px 9px rgba(40,50,30,.22))' }}>
        <div style={{ position: 'absolute', bottom: 34, left: 21, width: 11, height: 62, background: 'linear-gradient(#6f9460,#4f6f47)', borderRadius: '6px 6px 0 0', clipPath: 'polygon(50% 0,100% 16%,100% 100%,0 100%,0 16%)', transform: 'rotate(-13deg)', transformOrigin: 'bottom' }} />
        <div style={{ position: 'absolute', bottom: 34, left: 30, width: 11, height: 72, background: 'linear-gradient(#79a06a,#547552)', borderRadius: '6px 6px 0 0', clipPath: 'polygon(50% 0,100% 14%,100% 100%,0 100%,0 14%)' }} />
        <div style={{ position: 'absolute', bottom: 34, left: 39, width: 11, height: 60, background: 'linear-gradient(#6f9460,#4f6f47)', borderRadius: '6px 6px 0 0', clipPath: 'polygon(50% 0,100% 16%,100% 100%,0 100%,0 16%)', transform: 'rotate(13deg)', transformOrigin: 'bottom' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 14, width: 42, height: 40, background: 'linear-gradient(160deg,#C9744A,#9c5532)', clipPath: 'polygon(10% 0,90% 0,80% 100%,20% 100%)', borderRadius: 3 }} />
        <div style={{ position: 'absolute', bottom: 36, left: 11, width: 48, height: 9, background: '#b3653f', borderRadius: 3 }} />
      </div>
    </>
  );
}
