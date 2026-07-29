import React from 'react';

/* Every label, counter, duration and unit in the product. Mono, uppercase,
   widely tracked, small — the system's only uppercase text. */
export function Label({ size = 'sm', tone = 'tertiary', children, style, as = 'div' }) {
  return React.createElement(as, {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: (size === 'lg' ? 10.5 : size === 'xs' ? 8.5 : 9.5) + 'px',
      letterSpacing: size === 'lg' ? 'var(--label-tracking-tight)' : 'var(--label-tracking)',
      textTransform: 'uppercase',
      color: tone === 'secondary' ? 'var(--ink-2)' : tone === 'primary' ? 'var(--ink-1)' : 'var(--ink-3)',
      ...style,
    },
  }, children);
}
