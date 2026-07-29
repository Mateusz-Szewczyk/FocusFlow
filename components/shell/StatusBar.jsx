import React from 'react';

/* A drawn iOS status bar: mono time, three dots and a battery outline. */
export function StatusBar({ time = '9:41', style }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '15px 28px 4px', fontFamily: 'var(--font-mono)', fontSize: 10.5,
      fontVariantNumeric: 'tabular-nums', color: 'var(--ink-2)', flex: '0 0 auto', ...style,
    }}>
      <span>{time}</span>
      <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {[0, 1, 2].map(i => <span key={i} style={{
          width: 3.5, height: 3.5, borderRadius: '50%', background: 'currentColor', opacity: .5,
        }} />)}
        <span style={{
          width: 19, height: 9, border: '1px solid currentColor', borderRadius: 2, opacity: .5,
        }} />
      </span>
    </div>
  );
}
