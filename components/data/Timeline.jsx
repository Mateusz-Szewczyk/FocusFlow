import React from 'react';

/* The day as a thread: a hairline spine, one dot per block. */
export function Timeline({ items = [], style }) {
  return (
    <div style={{ position: 'relative', paddingLeft: 26, marginTop: 6, ...style }}>
      <span style={{
        content: '""', position: 'absolute', left: 2, top: 8, bottom: 8,
        width: 1, background: 'var(--hairline)',
      }} />
      {items.map((it, i) => (
        <div key={i} style={{ position: 'relative', padding: '0 0 20px', display: 'flex', gap: 12, alignItems: 'baseline' }}>
          <span style={{
            position: 'absolute', left: -26, top: 6, width: 5, height: 5, borderRadius: '50%',
            background: it.state === 'now' ? 'var(--accent)'
              : it.state === 'done' ? 'var(--ink-3)' : 'var(--hairline)',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-3)', flex: '0 0 40px',
          }}>{it.time}</span>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.4,
            color: it.state === 'done' ? 'var(--ink-3)' : 'var(--ink-1)',
          }}>{it.name}</span>
        </div>
      ))}
    </div>
  );
}
