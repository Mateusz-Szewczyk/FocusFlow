import React from 'react';

/* The device the prototype lives in. The bezel is the only object in the
   system allowed a shadow. Set theme="dark" to run a night screen inside. */
export function PhoneFrame({ theme = 'light', width = 384, height = 796, children, style }) {
  return (
    <div style={{
      width: `min(${width}px, 94vw)`, height: `min(${height}px, 80vh)`, minHeight: 610,
      borderRadius: 'var(--radius-device)', padding: 9, background: '#0A0D0C',
      boxShadow: 'var(--shadow-device)', ...style,
    }}>
      <div data-theme={theme} style={{
        width: '100%', height: '100%', borderRadius: 'var(--radius-screen)', overflow: 'hidden',
        position: 'relative', background: 'var(--paper)', color: 'var(--ink-1)',
        transition: 'background var(--dur-theme), color var(--dur-theme)',
        display: 'flex', flexDirection: 'column',
      }}>{children}</div>
    </div>
  );
}
