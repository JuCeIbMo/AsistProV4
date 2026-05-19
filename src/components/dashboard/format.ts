export function fmt(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '—';
  const n = parseFloat(String(value));
  if (isNaN(n)) return '—';
  return n.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmtCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
  if (abs >= 1_000) return (value / 1_000).toFixed(1) + 'k';
  return value.toFixed(0);
}
