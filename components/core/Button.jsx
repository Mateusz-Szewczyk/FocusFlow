import React from 'react';

/* One primary action per screen. Everything else is a ghost, a tiny mono link
   or an inline underline. Hover is opacity or a step up in ink — never a
   colour change, never a shadow, never a transform. */

const VARIANTS = {
  primary: {
    display: 'block', width: '100%', border: 0, borderRadius: 'var(--radius-button)',
    padding: '16px', fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 500,
    background: 'var(--accent)', color: 'var(--accent-on)',
  },
  quiet: {
    display: 'block', width: '100%', borderRadius: 'var(--radius-button)',
    padding: '16px', fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 500,
    background: 'transparent', color: 'var(--ink-2)', border: '1px solid var(--hairline)',
  },
  tiny: {
    display: 'block', width: '100%', border: 0, background: 'none', padding: '13px 0',
    fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: 'var(--label-tracking-tight)',
    textTransform: 'uppercase', color: 'var(--ink-3)',
  },
  inline: {
    display: 'inline-block', background: 'none', border: 0, padding: '0 0 3px',
    fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--ink-2)',
    textAlign: 'left', borderBottom: '1px solid var(--hairline)',
  },
};

const HOVER = {
  primary: { opacity: .88 },
  quiet: { opacity: .88 },
  tiny: { color: 'var(--ink-2)' },
  inline: { color: 'var(--ink-1)' },
};

export function Button({ variant = 'primary', children, style, onClick, type = 'button', ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type={type} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        cursor: 'pointer', transition: 'opacity .2s, color .2s',
        ...VARIANTS[variant], ...(hover ? HOVER[variant] : null), ...style,
      }} {...rest}>{children}</button>
  );
}
