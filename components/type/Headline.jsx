import React from 'react';

/* Headlines are short sentences with a full stop, set in the bookish serif. */
const SIZE = { xl: 42, l: 32, m: 24, s: 19 };

export function Headline({ size = 'm', as = 'h2', children, style }) {
  return React.createElement(as, {
    style: {
      fontFamily: 'var(--font-display)', fontWeight: 400,
      fontSize: SIZE[size] + 'px', lineHeight: size === 's' ? 1.45 : 1.16,
      letterSpacing: 'var(--display-tracking)', margin: 0, color: 'var(--ink-1)',
      textWrap: 'pretty', ...style,
    },
  }, children);
}
