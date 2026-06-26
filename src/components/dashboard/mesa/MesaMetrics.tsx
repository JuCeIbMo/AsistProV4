import type { CSSProperties } from 'react';
import { useMobile } from '../../../hooks/useMobile';

const mono: CSSProperties = { fontFamily: "'JetBrains Mono',monospace" };

export interface MesaMetric {
  kind?: 'single' | 'split';
  label: string;
  value: string;
  hint: string;
  hintColor: string;
  valueColor?: string;
  rotation: number;
  secondaryLabel?: string;
  secondaryValue?: string;
  secondaryValueColor?: string;
  currency?: string;
}

function MoneyValue({
  currency,
  amount,
  color,
  size,
}: {
  currency: string;
  amount: string;
  color: string;
  size: number;
}) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, color, minWidth: 0 }}>
      <span
        data-currency-token="true"
        style={{ ...mono, fontSize: '0.62em', letterSpacing: '.08em', opacity: 0.82, flexShrink: 0 }}
      >
        {currency}
      </span>
      <span
        style={{
          fontFamily: "'Playfair Display',serif",
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.1,
          overflowWrap: 'anywhere',
        }}
      >
        {amount}
      </span>
    </span>
  );
}

function Stub({ metric, isMobile }: { metric: MesaMetric; isMobile: boolean }) {
  return (
    <div
      className="mesa-lift"
      style={{
        position: 'relative',
        flex: 1,
        minWidth: isMobile ? 'calc(50% - 9px)' : 170,
        background: '#FCFAF2',
        borderRadius: 7,
        padding: isMobile ? '14px 16px' : '16px 20px',
        boxShadow: '0 10px 22px rgba(70,55,28,.13)',
        transform: `rotate(${metric.rotation}deg)`,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', left: -7, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, borderRadius: '50%', background: '#E4DCC8' }} />
      <div style={{ position: 'absolute', right: -7, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, borderRadius: '50%', background: '#E4DCC8' }} />
      <div style={{ ...mono, fontSize: 9.5, letterSpacing: '.14em', color: '#9a824a', textTransform: 'uppercase' }}>
        {metric.label}
      </div>
      {metric.kind === 'single' || metric.kind === undefined ? (
        <div
          style={{
            color: metric.valueColor || '#221f1b',
            marginTop: 4,
            minWidth: 0,
          }}
        >
          {metric.currency ? (
            <MoneyValue
              currency={metric.currency}
              amount={metric.value}
              color={metric.valueColor || '#221f1b'}
              size={isMobile ? 26 : 34}
            />
          ) : (
            <span
              style={{
                fontFamily: "'Playfair Display',serif",
                fontWeight: 700,
                fontSize: isMobile ? 26 : 34,
                lineHeight: 1.1,
                overflowWrap: 'anywhere',
              }}
            >
              {metric.value}
            </span>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
            <span style={{ ...mono, fontSize: 10, color: '#9a824a', textTransform: 'uppercase' }}>
              Ingresos
            </span>
            <span
              style={{ color: metric.valueColor || '#547552', minWidth: 0, textAlign: 'right' }}
            >
              {metric.currency ? (
                <MoneyValue
                  currency={metric.currency}
                  amount={metric.value}
                  color={metric.valueColor || '#547552'}
                  size={isMobile ? 20 : 26}
                />
              ) : (
                <span
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontWeight: 700,
                    fontSize: isMobile ? 20 : 26,
                    lineHeight: 1.1,
                    overflowWrap: 'anywhere',
                  }}
                >
                  {metric.value}
                </span>
              )}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
            <span style={{ ...mono, fontSize: 10, color: '#9a824a', textTransform: 'uppercase' }}>
              {metric.secondaryLabel}
            </span>
            <span
              style={{ color: metric.secondaryValueColor || '#C94E2C', minWidth: 0, textAlign: 'right' }}
            >
              {metric.currency ? (
                <MoneyValue
                  currency={metric.currency}
                  amount={metric.secondaryValue || ''}
                  color={metric.secondaryValueColor || '#C94E2C'}
                  size={isMobile ? 20 : 26}
                />
              ) : (
                <span
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontWeight: 700,
                    fontSize: isMobile ? 20 : 26,
                    lineHeight: 1.1,
                    overflowWrap: 'anywhere',
                  }}
                >
                  {metric.secondaryValue}
                </span>
              )}
            </span>
          </div>
        </div>
      )}
      <div style={{ ...mono, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: metric.hintColor, marginTop: 2 }}>
        {metric.hint}
      </div>
    </div>
  );
}

export function MesaMetrics({ metrics }: { metrics: MesaMetric[] }) {
  const isMobile = useMobile();

  return (
    <div style={{ position: 'relative' }}>
      {/* mancha de café – solo desktop */}
      {!isMobile && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: 130,
            height: 130,
            borderRadius: '50%',
            border: '8px solid rgba(120,75,40,.13)',
            right: 120,
            top: -36,
            pointerEvents: 'none',
            filter: 'blur(.5px)',
            zIndex: 1,
          }}
        />
      )}
      <div style={{ display: 'flex', gap: 18, margin: '26px 0 6px', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
        {metrics.map(m => (
          <Stub key={m.label} metric={m} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}
