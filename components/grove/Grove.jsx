import React from 'react';
import { treeNode, rng, ridgePath, understoryLines } from './Tree';

/* A week is a row you can read. A month is a stand with the newest week in
   front. A year is twelve stands on one horizon. Pale days stay in. */

const WEEK = [
  { d: 'M', stage: 3, green: 2 }, { d: 'T', stage: 4, green: 2 },
  { d: 'W', stage: 5, green: 3 }, { d: 'T', stage: 3, green: 1 },
  { d: 'F', stage: 5, green: 3 }, { d: 'S', stage: 1, green: 0 },
  { d: 'S', stage: -1, green: 0 },
];

const dayLabel = (key, x, y, text, opacity) => React.createElement('text', {
  key, x, y, textAnchor: 'middle', fontFamily: 'var(--font-mono)', fontSize: 9,
  fill: 'currentColor', opacity: opacity == null ? .45 : opacity,
}, text);

function weekArt(days, animate) {
  const r = rng(88), W = 324;
  const out = [ridgePath('ridge', 126, W, 4), ...understoryLines('u', 126, W, r, 26, .4)];
  days.forEach((t, i) => {
    out.push(treeNode('t' + i, 30 + i * 42, 126 - (i % 2) * 1.5, {
      stage: t.stage, green: t.green, size: .95, seed: i * 17 + 5, animate, delay: .15 + i * .12,
    }));
    out.push(dayLabel('d' + i, 30 + i * 42, 141, t.d));
  });
  return { viewBox: `0 0 ${W} 150`, nodes: out };
}

function monthArt(animate) {
  const r = rng(931), W = 324, H = 214;
  const out = [
    React.createElement('defs', { key: 'defs' },
      React.createElement('linearGradient', { id: 'ff-sky-month', x1: 0, y1: 0, x2: 0, y2: 1 },
        React.createElement('stop', { offset: '0', stopColor: 'var(--sky-top)' }),
        React.createElement('stop', { offset: '1', stopColor: 'var(--sky-bottom)' }))),
    React.createElement('rect', { key: 'sky', x: 0, y: 0, width: W, height: H, fill: 'url(#ff-sky-month)' }),
    React.createElement('path', {
      key: 'far', fill: 'none', stroke: 'var(--hairline)', strokeWidth: 1, opacity: .22,
      d: 'M-4 54 Q162 46 328 52',
    }),
  ];
  for (let row = 0; row < 5; row++) {
    const d = row / 4, y = 76 + row * 30, sc = .44 + d * .76, op = .32 + d * .68;
    out.push(React.createElement('path', {
      key: 'g' + row, fill: 'none', stroke: 'var(--hairline)', strokeWidth: 1,
      opacity: (.2 + d * .45).toFixed(2),
      d: `M${-6 - d * 4} ${y} Q162 ${y - 4 - d * 3} ${330 + d * 4} ${y}`,
    }));
    if (row > 1) out.push(...understoryLines('mu' + row, y, W, r, 10, .18 + d * .25));
    for (let i = 0; i < 7; i++) {
      const idx = row * 7 + i;
      if (idx >= 30) break;
      const q = r();
      out.push(treeNode('m' + idx, 24 + i * 43 + (r() - .5) * 16, y - r() * 2, {
        stage: q > .9 ? -1 : Math.max(1, Math.round(1 + q * 4.6)),
        green: q > .7 ? 3 : q > .4 ? 2 : q > .17 ? 1 : 0,
        size: sc, opacity: op, seed: idx * 29 + 7, animate, delay: .1 + row * .22 + i * .05,
      }));
    }
  }
  return { viewBox: `0 0 ${W} ${H}`, nodes: out };
}

function yearArt(animate) {
  const r = rng(2026);
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  const W = 324, H = 232, back = 150, front = 186;
  const out = [
    React.createElement('defs', { key: 'defs' },
      React.createElement('linearGradient', { id: 'ff-sky-year', x1: 0, y1: 0, x2: 0, y2: 1 },
        React.createElement('stop', { offset: '0', stopColor: 'var(--sky-top)' }),
        React.createElement('stop', { offset: '.62', stopColor: 'var(--sky-bottom)' }),
        React.createElement('stop', { offset: '1', stopColor: 'var(--sky-bottom)' })),
      React.createElement('linearGradient', { id: 'ff-mist-year', x1: 0, y1: 0, x2: 0, y2: 1 },
        React.createElement('stop', { offset: '0', stopColor: 'var(--sky-bottom)', stopOpacity: 0 }),
        React.createElement('stop', { offset: '1', stopColor: 'var(--sky-bottom)', stopOpacity: .9 }))),
    React.createElement('rect', { key: 'sky', x: 0, y: 0, width: W, height: H, fill: 'url(#ff-sky-year)' }),
    React.createElement('circle', { key: 'sun', className: 'ff-drift', cx: 266, cy: 44, r: 15, fill: 'var(--sun-disc)' }),
    React.createElement('path', {
      key: 'horizon', fill: 'none', stroke: 'var(--hairline)', strokeWidth: 1, opacity: .3,
      d: 'M0 78 Q110 68 176 74 Q252 81 324 71',
    }),
  ];
  for (let i = 0; i < 46; i++)
    out.push(treeNode('far' + i, r() * W, 76 + r() * 5, {
      stage: 1 + Math.round(r() * 2), green: 0, size: .2 + r() * .1,
      opacity: .3, seed: i * 17 + 3, animate, delay: .05 + r() * .3,
    }));
  out.push(React.createElement('rect', { key: 'mist', x: 0, y: 66, width: W, height: 34, fill: 'url(#ff-mist-year)' }));
  out.push(React.createElement('path', { key: 'b1', fill: 'none', stroke: 'var(--hairline)', strokeWidth: 1, opacity: .18, d: 'M-4 108 Q162 100 328 106' }));
  out.push(React.createElement('path', { key: 'b2', fill: 'none', stroke: 'var(--hairline)', strokeWidth: 1, opacity: .22, d: 'M-4 128 Q162 119 328 126' }));

  months.forEach((mo, mi) => {
    const cx = 18 + mi * 26.6, planted = mi <= 6;
    const vig = planted ? .32 + r() * .68 : 0;
    const nBack = planted ? 2 + Math.round(vig * 3) : 0;
    const nFront = planted ? 3 + Math.round(vig * 3) : 0;
    for (let i = 0; i < nBack; i++)
      out.push(treeNode(`yb${mi}_${i}`, cx + (i - nBack / 2) * 5.2 + (r() - .5) * 5, back - r() * 5, {
        stage: Math.max(1, Math.round(1 + vig * 3.6 - r() * 1.4)), green: vig > .66 ? 2 : 1,
        size: .36 + vig * .2, opacity: .5, seed: mi * 53 + i * 9, animate, delay: .35 + mi * .09 + i * .03,
      }));
    for (let i = 0; i < nFront; i++) {
      const d = i / Math.max(nFront - 1, 1);
      out.push(treeNode(`yf${mi}_${i}`, cx + (i - nFront / 2) * 5.4 + (r() - .5) * 6, front - r() * 6, {
        stage: Math.max(1, Math.round(1 + vig * 4.8 - r() * 1.6)),
        green: vig > .7 ? 3 : vig > .42 ? 2 : 1,
        size: .58 + d * .22 + vig * .22, opacity: .68 + d * .32,
        seed: mi * 61 + i * 7, animate, delay: .55 + mi * .09 + i * .03,
      }));
    }
    if (!planted) out.push(React.createElement('line', {
      key: 'e' + mi, x1: cx - 9, y1: front, x2: cx + 9, y2: front,
      stroke: 'var(--hairline)', strokeWidth: 1, opacity: .5,
    }));
    out.push(dayLabel('ym' + mi, cx, front + 18, mo, planted ? .5 : .25));
  });
  out.push(React.createElement('path', {
    key: 'front', fill: 'none', stroke: 'var(--hairline)', strokeWidth: 1,
    d: `M2 ${front} Q162 ${front - 4} 322 ${front}`,
  }));
  return { viewBox: `0 0 ${W} ${H}`, nodes: out };
}

export function Grove({ view = 'week', days = WEEK, animate = true, background = true, style }) {
  const art = view === 'month' ? monthArt(animate)
    : view === 'year' ? yearArt(animate)
      : weekArt(days, animate);
  return (
    <svg viewBox={art.viewBox} preserveAspectRatio="xMidYMid meet" role="img"
      aria-label={`Your ${view}, drawn as a grove`}
      style={{
        display: 'block', width: '100%', height: 'auto',
        background: background ? 'var(--sky)' : 'transparent',
        borderRadius: 'var(--radius-art)', color: 'var(--ink-1)', ...style,
      }}>
      {art.nodes}
    </svg>
  );
}
