import React from 'react';

/* A 4px dot and a sentence. Jade for what holds, amber for what needs care. */
export function BulletItem({ tone = 'accent', children, style }) {
  return (
    <div style={{
      display: 'flex', gap: 11, alignItems: 'flex-start', padding: '8px 0',
      fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.5, color: 'var(--ink-2)', ...style,
    }}>
      <span style={{
        flex: '0 0 auto', width: 4, height: 4, borderRadius: '50%', marginTop: 7,
        background: tone === 'caution' ? 'var(--caution)' : 'var(--accent)',
      }} />
      <div>{children}</div>
    </div>
  );
}
