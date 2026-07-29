import React from 'react';

/* ---------------------------------------------------------------------------
   The grove mechanic, drawn.
   Height  = blocks of protected time kept   -> stage 0..5 (Fibonacci 1·1·2·3·5·8)
   Leaves  = things finished                 -> leaves appear from stage 2
   Colour  = kept / planned                  -> green 0..3
   stage -1 is a planted rest day: a low moss arc, never a gap.
   Nothing withers and nothing is deleted.
--------------------------------------------------------------------------- */

export function rng(seed) {
  let s = seed % 233280;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}

/* growth decelerates: the trunk shoots up, then every fork after it takes longer
   and the last leaves open slowest of all — the same easing as the Fibonacci
   cost curve. A segment starts only once its parent is done. */
const DUR = [.24, .32, .42, .52, .64, .76, .88, 1.0];
const START = DUR.reduce((a, d, i) => (a.push(i ? a[i - 1] + DUR[i - 1] : 0), a), []);

function timing(level, isLeaf) {
  const i = Math.min(level, 7);
  return {
    animationDelay: `calc(var(--d, 0s) + ${START[i].toFixed(2)}s)`,
    animationDuration: `${(isLeaf ? Math.max(.14, DUR[i] * .8) : DUR[i]).toFixed(2)}s`,
  };
}

const PALETTE = [
  { stem: 'var(--ink-3)', leaf: 'var(--ink-3)' },
  { stem: 'var(--ink-2)', leaf: '#93AFA2' },
  { stem: 'var(--ink-2)', leaf: 'var(--leaf)' },
  { stem: 'var(--ink-1)', leaf: 'var(--accent)' },
];

function leafNode(key, x, y, ang, L, level, colour, animate) {
  const dx = Math.sin(ang) * L, dy = -Math.cos(ang) * L;
  const px = -dy * 0.44, py = dx * 0.44;
  const d = `M${x.toFixed(1)} ${y.toFixed(1)} C${(x + px).toFixed(1)} ${(y + py).toFixed(1)}, ` +
    `${(x + dx * .7 + px).toFixed(1)} ${(y + dy * .7 + py).toFixed(1)}, ${(x + dx).toFixed(1)} ${(y + dy).toFixed(1)} ` +
    `C${(x + dx * .7 - px).toFixed(1)} ${(y + dy * .7 - py).toFixed(1)}, ${(x - px).toFixed(1)} ${(y - py).toFixed(1)}, ` +
    `${x.toFixed(1)} ${y.toFixed(1)}`;
  return React.createElement('path', {
    key, d, pathLength: 1, fill: 'none', stroke: colour.leaf, strokeWidth: 1.1,
    strokeLinecap: 'round', strokeLinejoin: 'round',
    className: animate ? 'ff-grow' : undefined,
    style: animate ? timing(level, true) : undefined,
  });
}

function branch(x, y, len, ang, depth, w, out, rand, o, level, colour) {
  const x2 = x + Math.sin(ang) * len, y2 = y - Math.cos(ang) * len;
  const bow = (rand() - .5) * len * .3;
  const mx = (x + x2) / 2 + Math.cos(ang) * bow, my = (y + y2) / 2 + Math.sin(ang) * bow;
  out.push(React.createElement('path', {
    key: 's' + out.length, pathLength: 1, fill: 'none', stroke: colour.stem,
    strokeWidth: Math.max(.45, w).toFixed(2), strokeLinecap: 'round',
    d: `M${x.toFixed(1)} ${y.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`,
    className: o.animate ? 'ff-grow' : undefined,
    style: o.animate ? timing(level) : undefined,
  }));
  if (depth <= 0) {
    if (o.leaves) out.push(leafNode('l' + out.length, x2, y2, ang, 4.4 * o.size, level + 1, colour, o.animate));
    return;
  }
  const a1 = .28 + rand() * .24, a2 = .28 + rand() * .24;
  branch(x2, y2, len * (.68 + rand() * .10), ang - a1, depth - 1, w * .68, out, rand, o, level + 1, colour);
  branch(x2, y2, len * (.66 + rand() * .12), ang + a2, depth - 1, w * .68, out, rand, o, level + 1, colour);
  if (depth >= 3 && rand() > .55)
    branch(x2, y2, len * .46, ang + (rand() - .5) * .6, depth - 2, w * .55, out, rand, o, level + 2, colour);
}

/* Returns an <g> of SVG nodes standing on (x, y). Use inside your own <svg>. */
export function treeNode(key, x, y, options) {
  const o = Object.assign(
    { stage: 3, green: 2, size: 1, opacity: 1, seed: 7, animate: false, sway: true, delay: null },
    options);
  const colour = PALETTE[Math.max(0, Math.min(3, o.green))];
  const rand = rng(o.seed * 7919 + 31);
  const style = {};
  if (o.delay != null) style['--d'] = o.delay.toFixed(2) + 's';
  if (o.sway) {
    /* taller trees lean further and slower; saplings flicker a little quicker */
    const amp = Math.min(5.5, 2.2 + o.size * 1.5 + rand() * 1.2);
    const dur = 3.2 + Math.min(o.size, 2) * 1.3 + rand() * 2.6;
    style['--amp'] = amp.toFixed(2) + 'deg';
    style.animationDuration = dur.toFixed(1) + 's';
    style.animationDelay = '-' + (rand() * dur).toFixed(1) + 's';
  }
  const wrap = kids => React.createElement('g',
    { key, className: o.sway ? 'ff-sway' : undefined, opacity: o.opacity, style }, kids);

  if (o.stage < 0) return wrap([React.createElement('path', {
    key: 'moss', pathLength: 1, fill: 'none', stroke: colour.leaf, strokeWidth: 1.1, strokeLinecap: 'round',
    d: `M${x - 5 * o.size} ${y} q${5 * o.size} ${-6.5 * o.size} ${10 * o.size} 0`,
  })]);

  if (o.stage === 0) return wrap([
    React.createElement('path', {
      key: 'stem', pathLength: 1, fill: 'none', stroke: colour.stem, strokeWidth: 1.1 * o.size,
      strokeLinecap: 'round',
      className: o.animate ? 'ff-grow' : undefined, style: o.animate ? timing(0) : undefined,
      d: `M${x} ${y} q${1.6 * o.size} ${-6 * o.size} ${.4 * o.size} ${-11 * o.size}`,
    }),
    leafNode('leaf', x + .4 * o.size, y - 11 * o.size, .5, 4.6 * o.size, 1, colour, o.animate),
  ]);

  const out = [];
  o.leaves = o.stage >= 2 && o.size > .5;
  branch(x, y, (11 + o.stage * 3.2) * o.size, (rand() - .5) * .14,
    Math.min(5, o.stage), 1.7 * o.size, out, rand, o, 0, colour);
  return wrap(out);
}

/* A single tree standing on its own patch of ground. */
export function Tree({
  stage = 3, green = 2, size = 1.6, seed = 4, animate = true, sway = true,
  ground = true, width = 96, height = 132, style,
}) {
  const base = height - 8;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%"
      style={{ display: 'block', height: 'auto', overflow: 'visible', ...style }} aria-hidden="true">
      {ground && <line x1={width * .12} y1={base} x2={width * .88} y2={base}
        stroke="var(--hairline)" strokeWidth="1" />}
      {treeNode('t', width / 2, base, { stage, green, size, seed, animate, sway, delay: .15 })}
    </svg>
  );
}

/* ground furniture shared by the landscapes */
export function ridgePath(key, y, w, dip, opacity) {
  return React.createElement('path', {
    key, className: 'ff-ground', fill: 'none', stroke: 'var(--hairline)', strokeWidth: 1,
    opacity: opacity == null ? 1 : opacity,
    d: `M0 ${y} Q${w / 2} ${y - (dip || 5)} ${w} ${y}`,
  });
}

export function understoryLines(key, y, w, rand, n, opacity) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const x = rand() * w, h = 2 + rand() * 4;
    out.push(React.createElement('line', {
      key: key + i, stroke: 'var(--hairline)', strokeWidth: 1, opacity: opacity || .5,
      x1: x.toFixed(1), y1: y, x2: (x + (rand() - .5) * 2).toFixed(1), y2: (y - h).toFixed(1),
    }));
  }
  return out;
}
