import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import {
  fetchCategories,
  updateCategory,
  updateSettings,
  type Category,
} from '../../../services/dashboardService';
import { useMobile } from '../../../hooks/useMobile';

const mono: CSSProperties = { fontFamily: "'JetBrains Mono',monospace" };

const CURRENCIES = [
  { code: 'BOB', label: 'BOB — Boliviano' },
  { code: 'USD', label: 'USD — Dólar estadounidense' },
  { code: 'EUR', label: 'EUR — Euro' },
  { code: 'ARS', label: 'ARS — Peso argentino' },
  { code: 'CLP', label: 'CLP — Peso chileno' },
  { code: 'COP', label: 'COP — Peso colombiano' },
  { code: 'MXN', label: 'MXN — Peso mexicano' },
  { code: 'PEN', label: 'PEN — Sol peruano' },
  { code: 'BRL', label: 'BRL — Real brasileño' },
  { code: 'PYG', label: 'PYG — Guaraní' },
  { code: 'UYU', label: 'UYU — Peso uruguayo' },
  { code: 'VES', label: 'VES — Bolívar' },
];

const KIND_LABELS: Record<string, string> = {
  expense: 'Gastos',
  income: 'Ingresos',
  appointment: 'Citas',
};

interface MesaAjustesViewProps {
  currentCurrency: string;
  onSaved: () => void;
  onUnauthorized: () => void;
}

function SectionCard({ title, subtitle, rotation, children }: {
  title: string;
  subtitle?: string;
  rotation: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="mesa-card"
      style={{
        background: '#FCFAF2',
        borderRadius: 8,
        padding: '24px 28px',
        boxShadow: '0 16px 34px rgba(70,55,28,.14), inset 0 1px 0 rgba(255,255,255,.6)',
        transform: `rotate(${rotation}deg)`,
        position: 'relative',
      }}
    >
      <div style={{ borderBottom: '1px dashed #D9CDA8', paddingBottom: 14, marginBottom: 20 }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: '#221f1b', fontWeight: 400 }}>{title}</div>
        {subtitle && <div style={{ ...mono, fontSize: 10, color: '#9a824a', marginTop: 4, letterSpacing: '.1em', textTransform: 'uppercase' }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

export function MesaAjustesView({ currentCurrency, onSaved, onUnauthorized }: MesaAjustesViewProps) {
  const isMobile = useMobile();
  // ── currency ──
  const [currency, setCurrency]       = useState(currentCurrency);
  const [savingCur, setSavingCur]     = useState(false);
  const [curError, setCurError]       = useState<string | null>(null);
  const [curSaved, setCurSaved]       = useState(false);
  const currencyOptions = CURRENCIES.some(c => c.code === currentCurrency)
    ? CURRENCIES
    : [{ code: currentCurrency, label: currentCurrency }, ...CURRENCIES];

  async function handleSaveCurrency() {
    if (currency === currentCurrency) return;
    setSavingCur(true);
    setCurError(null);
    setCurSaved(false);
    const res = await updateSettings({ base_currency: currency });
    setSavingCur(false);
    if (!res.ok) {
      if (res.status === 'unauthorized') { onUnauthorized(); return; }
      setCurError('No se pudo guardar. Intenta de nuevo.');
      return;
    }
    setCurSaved(true);
    onSaved();
    setTimeout(() => setCurSaved(false), 2500);
  }

  // ── categories ──
  const [categories, setCategories]   = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [catError, setCatError]       = useState(false);
  const [savingId, setSavingId]       = useState<string | null>(null);
  const [editName, setEditName]       = useState<Record<string, string>>({});
  const [feedback, setFeedback]       = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setLoadingCats(true);
    setCatError(false);
    setFeedback(null);
    const res = await fetchCategories();
    setLoadingCats(false);
    if (!res.ok) {
      if (res.status === 'unauthorized') { onUnauthorized(); return; }
      setCatError(true);
      return;
    }
    setCategories(res.data.categories);
    const names: Record<string, string> = {};
    res.data.categories.forEach(c => (names[c.id] = c.display_name));
    setEditName(names);
  }, [onUnauthorized]);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  async function handleToggle(cat: Category) {
    setSavingId(cat.id);
    setFeedback(null);
    const res = await updateCategory(cat.id, { is_active: !cat.is_active });
    if (!res.ok) {
      if (res.status === 'unauthorized') { onUnauthorized(); } else { setFeedback('No se pudo actualizar.'); }
      setSavingId(null);
      return;
    }
    setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, is_active: !c.is_active } : c));
    setSavingId(null);
  }

  async function handleSaveName(cat: Category) {
    const newName = editName[cat.id]?.trim();
    if (!newName || newName === cat.display_name) return;
    setSavingId(cat.id);
    setFeedback(null);
    const res = await updateCategory(cat.id, { display_name: newName });
    if (!res.ok) {
      if (res.status === 'unauthorized') { onUnauthorized(); } else { setFeedback('Ese nombre ya existe o es inválido.'); }
      setSavingId(null);
      return;
    }
    setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, display_name: newName } : c));
    setSavingId(null);
  }

  const grouped = categories.reduce<Record<string, Category[]>>((acc, c) => {
    if (!acc[c.kind]) acc[c.kind] = [];
    acc[c.kind].push(c);
    return acc;
  }, {});

  return (
    <section>
      {/* HEADER */}
      <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 30 }}>
        <div>
          <div style={{ ...mono, fontSize: 11, letterSpacing: '.14em', color: '#8a7c5e', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ display: 'block', width: 18, height: 1, background: '#A8997A' }} />
            Configuración de cuenta
          </div>
          <h1 style={{ fontFamily: "'Dancing Script',cursive", fontWeight: 700, fontSize: isMobile ? 38 : 52, lineHeight: 1.05, margin: '4px 0 10px', color: '#221f1b' }}>
            Ajustes
          </h1>
        </div>
      </header>

      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* LEFT: currency + plan info */}
        <div style={{ flex: 1, minWidth: isMobile ? '100%' : 300, display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* MONEDA */}
          <SectionCard title="Moneda base" subtitle="afecta registros nuevos" rotation={-0.4}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, ...mono, fontSize: 10, letterSpacing: '.12em', color: '#9a824a', textTransform: 'uppercase' }}>
              Moneda activa
            </div>
            <div style={{ position: 'relative' }}>
              <select
                value={currency}
                onChange={e => { setCurrency(e.target.value); setCurSaved(false); }}
                disabled={savingCur}
                style={{
                  width: '100%',
                  borderRadius: 7,
                  padding: '10px 14px',
                  fontSize: 14,
                  background: '#F5F1E4',
                  color: '#1A1816',
                  border: '1.5px solid rgba(140,112,52,.3)',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: "'DM Sans',sans-serif",
                  appearance: 'none',
                }}
              >
                {currencyOptions.map(c => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
              <span aria-hidden="true" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9a824a', fontSize: 12 }}>▾</span>
            </div>
            <p style={{ ...mono, fontSize: 10, color: '#9a824a', margin: '8px 0 0', lineHeight: 1.5 }}>
              Se infiere por región al crear tu cuenta. Cambiarla solo afecta registros nuevos.
            </p>
            {curError && <p style={{ ...mono, fontSize: 11, color: '#C94E2C', marginTop: 8 }}>{curError}</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 16, alignItems: 'center' }}>
              <button
                onClick={handleSaveCurrency}
                disabled={savingCur || currency === currentCurrency}
                className="mesa-btn-dark"
                style={{ padding: '9px 20px', borderRadius: 7, border: 'none', cursor: currency === currentCurrency || savingCur ? 'default' : 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, background: currency === currentCurrency || savingCur ? '#c8c0ae' : '#1A1816', color: '#F5F1E8', opacity: currency === currentCurrency || savingCur ? 0.65 : 1 }}
              >
                {savingCur ? 'Guardando…' : 'Guardar'}
              </button>
              {curSaved && <span style={{ ...mono, fontSize: 11, color: '#547552' }}>✓ Guardado</span>}
            </div>
          </SectionCard>

          {/* PLAN INFO */}
          <div
            style={{
              background: 'rgba(255,253,246,.6)',
              border: '1px dashed rgba(140,112,52,.4)',
              borderRadius: 8,
              padding: '18px 22px',
              transform: 'rotate(.3deg)',
            }}
          >
            <div style={{ ...mono, fontSize: 9, letterSpacing: '.12em', color: '#9a824a', textTransform: 'uppercase' }}>Tu plan</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: '#221f1b', margin: '4px 0 6px' }}>Pro</div>
            <div style={{ fontSize: 13, color: '#5c4d22' }}>agenda · pagos · whatsapp</div>
            <div style={{ height: 5, background: 'rgba(140,112,52,.2)', borderRadius: 100, marginTop: 12, overflow: 'hidden' }}>
              <div style={{ width: '68%', height: '100%', background: '#547552', borderRadius: 100 }} />
            </div>
            <div style={{ ...mono, fontSize: 10, color: '#9a824a', marginTop: 6 }}>68% del ciclo · renueva el 30 de este mes</div>
          </div>

        </div>

        {/* RIGHT: categories */}
        <div style={{ flex: 1.6, minWidth: isMobile ? '100%' : 360 }}>
          <SectionCard title="Categorías" subtitle="activar · renombrar · organizar" rotation={0.3}>

            {feedback && (
              <div style={{ ...mono, fontSize: 11, color: '#C94E2C', background: '#FAE8E2', borderRadius: 6, padding: '8px 12px', marginBottom: 14 }}>
                {feedback}
              </div>
            )}

            {loadingCats ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[1,2,3,4].map(n => (
                  <div key={n} style={{ height: 46, background: '#F0EBD9', borderRadius: 7, animation: 'none', opacity: 0.6 }} />
                ))}
              </div>
            ) : catError ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ ...mono, fontSize: 12, color: '#A8997A', marginBottom: 12 }}>No se pudieron cargar las categorías.</div>
                <button onClick={loadCategories} style={{ ...mono, fontSize: 11, border: '1px solid rgba(168,153,122,.6)', borderRadius: 7, padding: '8px 16px', background: 'transparent', color: '#6a5828', cursor: 'pointer' }}>Reintentar</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {Object.entries(grouped).map(([kind, items]) => (
                  <div key={kind}>
                    <div style={{ ...mono, fontSize: 9.5, letterSpacing: '.14em', color: '#9a824a', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                      {KIND_LABELS[kind] || kind}
                      <span style={{ flex: 1, height: 1, background: '#D9CDA8' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {items.map(cat => (
                        <div
                          key={cat.id}
                          className="mesa-row"
                          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 6, background: '#F8F4E8', border: '1px solid rgba(217,205,168,.5)' }}
                        >
                          {/* active dot */}
                          <span
                            style={{ width: 8, height: 8, borderRadius: '50%', background: cat.is_active ? '#547552' : '#c8c0ae', flexShrink: 0, transition: 'background .15s' }}
                            aria-hidden="true"
                          />
                          {/* editable name */}
                          <input
                            type="text"
                            value={editName[cat.id] ?? cat.display_name}
                            onChange={e => setEditName(prev => ({ ...prev, [cat.id]: e.target.value }))}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSaveName(cat);
                              if (e.key === 'Escape') setEditName(prev => ({ ...prev, [cat.id]: cat.display_name }));
                            }}
                            onBlur={() => handleSaveName(cat)}
                            disabled={savingId === cat.id}
                            aria-label={`Nombre de categoría ${cat.display_name}`}
                            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13.5, color: cat.is_active ? '#221f1b' : '#A8997A', fontFamily: "'DM Sans',sans-serif", borderBottom: '1px solid transparent', transition: 'border-color .15s' }}
                            onFocus={e => (e.currentTarget.style.borderBottomColor = '#C94E2C')}
                          />
                          {savingId === cat.id && (
                            <span style={{ ...mono, fontSize: 10, color: '#9a824a' }}>guardando…</span>
                          )}
                          {/* toggle */}
                          <button
                            onClick={() => handleToggle(cat)}
                            disabled={savingId === cat.id}
                            title={cat.is_active ? 'Activa — desactivar' : 'Inactiva — activar'}
                            aria-label={cat.is_active ? 'Desactivar categoría' : 'Activar categoría'}
                            style={{
                              flexShrink: 0,
                              width: 36,
                              height: 20,
                              borderRadius: 100,
                              border: 'none',
                              background: cat.is_active ? '#547552' : '#c8c0ae',
                              position: 'relative',
                              cursor: savingId === cat.id ? 'default' : 'pointer',
                              transition: 'background .2s',
                              opacity: savingId === cat.id ? 0.5 : 1,
                            }}
                          >
                            <span style={{
                              position: 'absolute',
                              top: 3,
                              left: cat.is_active ? 17 : 3,
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              background: '#fff',
                              transition: 'left .2s',
                              boxShadow: '0 1px 3px rgba(0,0,0,.2)',
                            }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </SectionCard>
        </div>

      </div>
    </section>
  );
}
