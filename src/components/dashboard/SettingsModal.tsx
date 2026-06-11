import { useState } from 'react';
import { updateSettings } from '../../services/dashboardService';
import { Button, Modal } from '../ui';
import { darkColors } from '../../styles/tokens';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCurrency: string;
  onSaved: () => void;
  onUnauthorized: () => void;
}

// Monedas más comunes para los mercados objetivo. Si la moneda actual del usuario
// no está en la lista (p. ej. una inferida poco común), se antepone para no perderla.
const CURRENCIES: { code: string; label: string }[] = [
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

export function SettingsModal({
  isOpen,
  onClose,
  currentCurrency,
  onSaved,
  onUnauthorized,
}: SettingsModalProps) {
  const [currency, setCurrency] = useState(currentCurrency);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const options = CURRENCIES.some((c) => c.code === currentCurrency)
    ? CURRENCIES
    : [{ code: currentCurrency, label: currentCurrency }, ...CURRENCIES];

  const dirty = currency !== currentCurrency;

  async function handleSave() {
    if (!dirty) {
      onClose();
      return;
    }
    setSubmitting(true);
    setError(null);
    const result = await updateSettings({ base_currency: currency });
    if (!result.ok) {
      setSubmitting(false);
      if (result.status === 'unauthorized') {
        onUnauthorized();
      } else {
        setError('No pudimos guardar el cambio. Inténtalo de nuevo.');
      }
      return;
    }
    setSubmitting(false);
    onSaved();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configuración">
      <div className="space-y-5">
        <div>
          <label
            htmlFor="settings-currency"
            className="block text-xs font-medium uppercase tracking-wider mb-1.5"
            style={{ color: darkColors.muted }}
          >
            Moneda base
          </label>
          <select
            id="settings-currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            disabled={submitting}
            className="w-full rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/40"
            style={{
              backgroundColor: darkColors.elevated,
              color: darkColors['text-primary'],
              border: `1px solid ${darkColors.border}`,
            }}
          >
            {options.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
          <p className="text-xs mt-2" style={{ color: darkColors.muted }}>
            Se asigna automáticamente según tu país. Cambiarla sólo afecta los
            registros nuevos: no convierte los montos anteriores.
          </p>
        </div>

        {error && (
          <p className="text-red-400 text-sm" role="alert">
            {error}
          </p>
        )}

        <div className="flex gap-3 justify-end pt-1">
          <Button variant="secondary" size="md" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="primary" size="md" loading={submitting} onClick={handleSave}>
            Guardar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
