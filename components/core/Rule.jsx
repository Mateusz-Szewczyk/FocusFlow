import React from 'react';

/* The only divider in the product. 30px of air either side by default. */
export function Rule({ gap = 30, style }) {
  return <hr style={{
    height: 1, background: 'var(--hairline)', border: 0,
    margin: `${gap}px 0`, ...style,
  }} />;
}
