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
  align = 'left',
}: {
  currency: string;
  amount: string;
  color: string;
  size: number;
  align?: 'left' | 'right';
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        gap: 6,
        color,
        minWidth: 0,
        maxWidth: '100%',
      }}
    >
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
  const isMobileSplit = isMobile && metric.kind === 'split';

  return (
    <div
      className="mesa-lift"
      style={{
        position: 'relative',
        flex: isMobile ? (isMobileSplit ? '1 1 100%' : '1 1 calc(50% - 5px)') : 1,
        minWidth: isMobile ? (isMobileSplit ? '100%' : 'calc(50% - 5px)') : 170,
        background: '#FCFAF2',
        borderRadius: 7,
        padding: isMobile ? (isMobileSplit ? '14px 16px 15px' : '13px 16px 14px') : '16px 20px',
        boxShadow: isMobile ? '0 8px 18px rgba(70,55,28,.11)' : '0 10px 22px rgba(70,55,28,.13)',
        transform: isMobile ? 'none' : `rotate(${metric.rotation}deg)`,
        overflow: 'hidden',
      }}
    >
      {!isMobile && (
        <>
          <div style={{ position: 'absolute', left: -7, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, borderRadius: '50%', background: '#E4DCC8' }} />
          <div style={{ position: 'absolute', right: -7, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, borderRadius: '50%', background: '#E4DCC8' }} />
        </>
      )}
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
              size={isMobile ? 24 : 34}
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2,minmax(0,1fr))' : '1fr',
            gap: isMobile ? 14 : 8,
            marginTop: 10,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'stretch', gap: 3, minWidth: 0 }}>
            <span style={{ ...mono, fontSize: 10, color: '#9a824a', textTransform: 'uppercase' }}>
              Ingresos
            </span>
            <span
              style={{ color: metric.valueColor || '#547552', minWidth: 0, textAlign: isMobile ? 'left' : 'right' }}
            >
              {metric.currency ? (
                <MoneyValue
                  currency={metric.currency}
                  amount={metric.value}
                  color={metric.valueColor || '#547552'}
                  size={isMobile ? 21 : 26}
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-end' : 'stretch', gap: 3, minWidth: 0 }}>
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
                  size={isMobile ? 21 : 26}
                  align="right"
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
      <div style={{ ...mono, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: metric.hintColor, marginTop: isMobile ? 8 : 2 }}>
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
      <div style={{ display: 'flex', gap: isMobile ? 10 : 18, margin: isMobile ? '18px 0 6px' : '26px 0 6px', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
        {metrics.map(m => (
          <Stub key={m.label} metric={m} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}
