import React from 'react';

/* Three tabs, mono caps, over a hairline. No icons — this product has none. */
export function TabBar({ tabs = [], current, onChange, style }) {
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-around', padding: '14px 26px 24px',
      borderTop: '1px solid var(--hairline)', flex: '0 0 auto', ...style,
    }}>
      {tabs.map(t => (
        <button key={t.value} type="button" onClick={() => onChange && onChange(t.value)}
          aria-current={t.value === current ? 'page' : undefined}
          style={{
            background: 'none', border: 0, cursor: 'pointer', padding: '6px 10px',
            fontFamily: 'var(--font-mono)', fontSize: 9.5,
            letterSpacing: 'var(--label-tracking-tight)', textTransform: 'uppercase',
            color: t.value === current ? 'var(--ink-1)' : 'var(--ink-3)',
          }}>{t.label}</button>
      ))}
    </nav>
  );
}
