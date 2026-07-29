import React from 'react';

/* Body copy: calm, adult, 13–15px, line-height 1.8, secondary ink. */
export function Note({ size = 'md', children, style, as = 'p' }) {
  return React.createElement(as, {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: (size === 'lg' ? 15 : size === 'sm' ? 12 : 13) + 'px',
      lineHeight: 'var(--body-leading)', color: 'var(--ink-2)', margin: 0,
      textWrap: 'pretty', ...style,
    },
  }, children);
}
