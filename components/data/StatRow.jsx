import React from 'react';

/* Key on the left in sans, value on the right in mono. Hairline underneath. */
export function StatRow({ label, value, last = false, style }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16,
      padding: '15px 0', borderBottom: last ? 0 : '1px solid var(--hairline)', ...style,
    }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--ink-1)' }}>{label}</span>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)',
        textAlign: 'right', flex: '0 0 auto',
      }}>{value}</span>
    </div>
  );
}
