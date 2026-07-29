import React from 'react';

/* "in 12 min" with a hairline that drains over the wait. Never a percentage. */
export function Countdown({ text = 'in 12 min', seconds = 720, width = 170, style }) {
  return (
    <div style={{ marginTop: 14, ...style }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums',
        fontSize: 15, color: 'var(--ink-1)', letterSpacing: '.01em',
      }}>{text}</span>
      <span style={{
        display: 'block', height: 1, background: 'var(--hairline)', marginTop: 10,
        maxWidth: width, overflow: 'hidden',
      }}>
        <span style={{
          display: 'block', height: '100%', width: '22%', background: 'var(--accent)',
          transformOrigin: 'left', animation: `ff-drain ${seconds}s linear forwards`,
        }} />
      </span>
    </div>
  );
}
