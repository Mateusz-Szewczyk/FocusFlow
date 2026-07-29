import React from 'react';

/* The focus session. A 15s sine breath, and a stem that grows across the whole
   block so there is something to notice but nothing to watch. */
export function BreathRing({ size = 186, seconds = 15, stem = true, style }) {
  const grow = { animation: `ff-draw ${seconds * 5.33}s linear infinite` };
  const leaf = i => ({
    opacity: 0,
    animation: `ff-leaf${i} ${seconds * 5.33}s linear infinite`,
  });
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden="true"
      style={{ display: 'block', margin: '0 auto', ...style }}>
      <style>{`
        @keyframes ff-leaf1 { 0%,26% { opacity:0 } 34%,100% { opacity:.85 } }
        @keyframes ff-leaf2 { 0%,52% { opacity:0 } 60%,100% { opacity:.85 } }
        @keyframes ff-leaf3 { 0%,78% { opacity:0 } 86%,100% { opacity:.85 } }
        @media (prefers-reduced-motion: reduce) {
          .ff-stem { stroke-dashoffset: 0 !important; animation: none !important }
          .ff-leaf { opacity: .85 !important; animation: none !important }
        }
      `}</style>
      <circle cx="100" cy="100" r="80" fill="none" stroke="var(--hairline)" strokeWidth="1" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="var(--accent)" strokeWidth="1.1"
        className="ff-breath" style={{ animationDuration: seconds + 's' }} />
      {stem && (
        <g opacity=".6">
          <path className="ff-stem" pathLength="1" fill="none" stroke="var(--accent)" strokeWidth="1.2"
            strokeLinecap="round" style={{ strokeDasharray: 1, strokeDashoffset: 1, ...grow }}
            d="M100 166 C96 146 104 128 100 104 C98 92 101 84 100 76" />
          <path className="ff-leaf" fill="none" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round"
            style={leaf(1)} d="M99 148 C88 148 84 140 96 136 C101 140 102 146 99 148" />
          <path className="ff-leaf" fill="none" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round"
            style={leaf(2)} d="M101 122 C112 122 116 114 104 110 C99 114 98 120 101 122" />
          <path className="ff-leaf" fill="none" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round"
            style={leaf(3)} d="M100 96 C89 96 85 88 97 84 C102 88 103 94 100 96" />
        </g>
      )}
    </svg>
  );
}
