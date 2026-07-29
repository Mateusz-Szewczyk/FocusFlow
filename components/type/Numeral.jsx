import React from 'react';

/* Times and counters are monospace and tabular so they never jitter. */
const SIZE = { sm: 15, md: 33, lg: 60 };

export function Numeral({ size = 'md', tone = 'primary', children, style, as = 'div' }) {
  return React.createElement(as, {
    className: 'ff-numeral',
    style: {
      fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums',
      fontSize: SIZE[size] + 'px', lineHeight: 1,
      letterSpacing: size === 'lg' ? '-.02em' : '.01em',
      color: tone === 'secondary' ? 'var(--ink-2)' : 'var(--ink-1)', ...style,
    },
  }, children);
}
