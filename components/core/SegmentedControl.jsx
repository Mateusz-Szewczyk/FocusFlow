import React from 'react';

/* Week / Month / Year. Two to four options, mono caps, hairline track. */
export function SegmentedControl({ options = [], value, onChange, style }) {
  return (
    <div style={{
      display: 'flex', gap: '2px', border: '1px solid var(--hairline)',
      borderRadius: 'var(--radius-pill)', padding: '3px', ...style,
    }}>
      {options.map(o => {
        const on = o.value === value;
        return (
          <button key={o.value} type="button" aria-pressed={on}
            onClick={() => onChange && onChange(o.value)}
            style={{
              flex: 1, background: on ? 'var(--ink-1)' : 'none', border: 0,
              borderRadius: 'var(--radius-pill)', padding: '8px 4px', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: '9.5px',
              letterSpacing: 'var(--label-tracking-tight)', textTransform: 'uppercase',
              color: on ? 'var(--paper)' : 'var(--ink-3)', transition: 'background .2s, color .2s',
            }}>{o.label}</button>
        );
      })}
    </div>
  );
}
