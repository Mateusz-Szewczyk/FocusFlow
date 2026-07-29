import React from 'react';

/* A pill of mono caps. Used for prototype screen switching and for filters. */
export function Chip({ selected = false, children, onClick, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onClick={onClick} aria-selected={selected} role="tab"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        flex: '0 0 auto', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-pill)',
        padding: '9px 14px', cursor: 'pointer', transition: 'color .25s, background .25s',
        fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: 'var(--label-tracking-tight)',
        textTransform: 'uppercase',
        background: selected ? 'var(--ink-1)' : 'transparent',
        borderColor: selected ? 'var(--ink-1)' : 'var(--hairline)',
        color: selected ? 'var(--paper)' : hover ? 'var(--ink-1)' : 'var(--ink-2)',
        ...style,
      }} {...rest}>{children}</button>
  );
}
