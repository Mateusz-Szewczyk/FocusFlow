import React from 'react';
import { treeNode, rng, understoryLines } from './Tree';

/* One exportable image: sky, a distant ridge, receding bands of forest,
   two cropped foreground trees, and the totals drawn into the artwork.
   Trees, days and totals only — never task names, app names or times. */
export function ShareArt({
  format = 'post', title = '2026', subtitle = '208 days planted',
  totals = '431 H PROTECTED · 612 THINGS FINISHED', wordmark = 'FOCUSFLOW', style,
}) {
  const W = 324, wide = format === 'wide';
  const H = format === 'story' ? 576 : wide ? 190 : 405;
  const r = rng(20260);
  const base = H - 24;
  const ridgeY = wide ? 74 : Math.round(H * .38);
  const nodes = [
    React.createElement('defs', { key: 'defs' },
      React.createElement('linearGradient', { id: 'ff-share-sky', x1: 0, y1: 0, x2: 0, y2: 1 },
        React.createElement('stop', { offset: '0', stopColor: 'var(--sky-top)' }),
        React.createElement('stop', { offset: '.55', stopColor: 'var(--sky-bottom)' }),
        React.createElement('stop', { offset: '1', stopColor: 'var(--sky-bottom)' })),
      React.createElement('linearGradient', { id: 'ff-share-mist', x1: 0, y1: 0, x2: 0, y2: 1 },
        React.createElement('stop', { offset: '0', stopColor: 'var(--sky-bottom)', stopOpacity: 0 }),
        React.createElement('stop', { offset: '1', stopColor: 'var(--sky-bottom)', stopOpacity: .9 }))),
    React.createElement('rect', { key: 'sky', x: 0, y: 0, width: W, height: H, fill: 'url(#ff-share-sky)' }),
    React.createElement('circle', {
      key: 'sun', className: 'ff-drift', cx: W - 62, cy: Math.round(ridgeY * .44),
      r: wide ? 15 : 20, fill: 'var(--sun-disc)',
    }),
    React.createElement('path', {
      key: 'ridge', fill: 'none', stroke: 'var(--hairline)', strokeWidth: 1, opacity: .3,
      d: `M0 ${ridgeY} Q${W * .32} ${ridgeY - 10} ${W * .6} ${ridgeY - 4} Q${W * .84} ${ridgeY + 2} ${W} ${ridgeY - 7}`,
    }),
  ];
  for (let i = 0; i < 44; i++)
    nodes.push(treeNode('far' + i, r() * W, ridgeY - 2 + r() * 5, {
      stage: 1 + Math.round(r() * 2), green: 0, size: .2 + r() * .12, opacity: .32, seed: i * 13 + 2,
    }));
  nodes.push(React.createElement('rect', {
    key: 'mist', x: 0, y: ridgeY - 16, width: W, height: 36, fill: 'url(#ff-share-mist)',
  }));

  const bands = wide ? 3 : 4;
  const span = base - ridgeY - (wide ? 14 : 34);
  for (let b = 0; b < bands; b++) {
    const d = b / (bands - 1);
    const y = ridgeY + 24 + span * d;
    const sc = .3 + d * .82, op = .42 + d * .58, n = (wide ? 13 : 16) - b * 3;
    nodes.push(React.createElement('path', {
      key: 'band' + b, fill: 'none', stroke: 'var(--hairline)', strokeWidth: 1,
      opacity: (.14 + d * .42).toFixed(2), d: `M-4 ${y} Q${W / 2} ${y - 7 - d * 4} ${W + 4} ${y}`,
    }));
    nodes.push(...understoryLines('su' + b, y, W, r, 16, .1 + d * .28));
    for (let i = 0; i < n; i++) {
      const q = r();
      nodes.push(treeNode(`s${b}_${i}`, 4 + i * (W - 8) / (n - 1) + (r() - .5) * 16, y - r() * 3, {
        stage: q > .93 ? -1 : Math.max(1, Math.round(1 + q * 4.4)),
        green: q > .66 ? 3 : q > .36 ? 2 : 1, size: sc, opacity: op, seed: b * 97 + i * 11,
      }));
    }
  }
  nodes.push(treeNode('fg1', 8, base + 6, { stage: 5, green: 3, size: wide ? 1.5 : 2.1, seed: 5 }));
  nodes.push(treeNode('fg2', W - 10, base + 8, { stage: 4, green: 3, size: wide ? 1.3 : 1.8, seed: 9 }));

  const tx = 26, ty = wide ? 44 : 58;
  nodes.push(React.createElement('text', {
    key: 't1', x: tx, y: ty, fontFamily: 'var(--font-display)', fontSize: wide ? 28 : 36, fill: 'currentColor',
  }, title));
  nodes.push(React.createElement('text', {
    key: 't2', x: tx, y: ty + (wide ? 21 : 29), fontFamily: 'var(--font-display)',
    fontSize: wide ? 14 : 17, fill: 'currentColor', opacity: .8,
  }, subtitle));
  nodes.push(React.createElement('text', {
    key: 't3', x: tx, y: ty + (wide ? 38 : 50), fontFamily: 'var(--font-mono)', fontSize: 8.5,
    letterSpacing: 1.6, fill: 'currentColor', opacity: .5,
  }, totals));
  nodes.push(React.createElement('text', {
    key: 't4', x: tx, y: base + 14, fontFamily: 'var(--font-mono)', fontSize: 7.5,
    letterSpacing: 2.4, fill: 'currentColor', opacity: .38,
  }, wordmark));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" role="img"
      aria-label={`${title}, ${subtitle}`}
      style={{
        display: 'block', width: '100%', height: 'auto', background: 'var(--sky)',
        color: 'var(--ink-1)', ...style,
      }}>{nodes}</svg>
  );
}
