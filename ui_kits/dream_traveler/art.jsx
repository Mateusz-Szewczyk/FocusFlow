/* Dream Traveler — the illustration layer.
   Everything is drawn: soft watercolour washes (turbulence + blur filters), a
   curled sleeping pet, a walking pet with a pack, the trail, the globe and the
   postcards. Pastel palette comes from the kit's CSS variables so a screen can
   be dusk or daylight without touching this file. */

const R = FF.rng;

/* ── washes ────────────────────────────────────────────────────────────────── */
let defsId = 0;
function Defs({ id }) {
  return (
    <defs>
      <filter id={`wc-${id}`} x="-25%" y="-25%" width="150%" height="150%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="3" seed={id * 7 + 3} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" />
        <feGaussianBlur stdDeviation="7" />
      </filter>
      <filter id={`wc-soft-${id}`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
      <filter id={`glow-${id}`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="5" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
  );
}

/* a band of blotches: the base texture of every screen in this kit */
function wash(id, w, h, bands, seed) {
  const r = R(seed * 131 + 17);
  const out = [];
  bands.forEach((b, i) => {
    const n = b.blobs || 3;
    for (let k = 0; k < n; k++) {
      const cy = b.y * h + (r() - 0.5) * h * 0.06;
      const cx = (0.16 + 0.7 * (k / Math.max(1, n - 1))) * w + (r() - 0.5) * 60;
      out.push(React.createElement('ellipse', {
        key: `b${i}_${k}`, cx: cx.toFixed(1), cy: cy.toFixed(1),
        rx: (w * (0.3 + r() * 0.24)).toFixed(1), ry: (h * (b.h || 0.1) * (0.7 + r() * 0.7)).toFixed(1),
        fill: b.fill, opacity: (b.opacity || 0.5).toFixed(2),
        filter: `url(#wc-${id})`,
      }));
    }
  });
  return out;
}

/* ── the pet ───────────────────────────────────────────────────────────────── */
/* One silhouette family, three postures. kind: 'dog' | 'cat' changes ears, muzzle
   and tail; coat is any CSS colour; line is the ink used for the contour. */
function petParts(kind, coat, line, posture, scale) {
  const s = scale, cat = kind === 'cat';
  const g = [];
  const push = (key, el) => g.push(el);

  if (posture === 'curled') {
    /* a comma: body arc, head tucked left, tail wrapped over the back */
    push('body', React.createElement('path', {
      key: 'body', fill: coat, stroke: line, strokeWidth: 1.6,
      d: `M${34 * s} ${74 * s} q${-14 * s} ${-30 * s} ${16 * s} ${-40 * s}
          q${34 * s} ${-11 * s} ${58 * s} ${6 * s} q${26 * s} ${19 * s} ${12 * s} ${40 * s}
          q${-10 * s} ${14 * s} ${-44 * s} ${12 * s} q${-32 * s} ${-2 * s} ${-42 * s} ${-18 * s} Z`,
    }));
    push('head', React.createElement('ellipse', {
      key: 'head', cx: 44 * s, cy: 62 * s, rx: 21 * s, ry: 18 * s,
      fill: coat, stroke: line, strokeWidth: 1.6,
    }));
    push('ear', React.createElement('path', {
      key: 'ear', fill: coat, stroke: line, strokeWidth: 1.4,
      d: cat
        ? `M${30 * s} ${52 * s} l${2 * s} ${-19 * s} l${15 * s} ${11 * s} Z`
        : `M${28 * s} ${50 * s} q${-11 * s} ${11 * s} ${2 * s} ${19 * s} q${10 * s} ${-7 * s} ${8 * s} ${-18 * s} Z`,
    }));
    if (cat) push('ear2', React.createElement('path', {
      key: 'ear2', fill: coat, stroke: line, strokeWidth: 1.4,
      d: `M${56 * s} ${49 * s} l${5 * s} ${-18 * s} l${11 * s} ${15 * s} Z`,
    }));
    push('eye', React.createElement('path', {
      key: 'eye', fill: 'none', stroke: line, strokeWidth: 1.5, strokeLinecap: 'round',
      d: `M${36 * s} ${63 * s} q${5 * s} ${4 * s} ${10 * s} 0`,
    }));
    push('nose', React.createElement('circle', {
      key: 'nose', cx: 26 * s, cy: 66 * s, r: 2 * s, fill: line, opacity: 0.75,
    }));
    push('tail', React.createElement('path', {
      key: 'tail', fill: 'none', stroke: line, strokeWidth: cat ? 5 * s : 7 * s,
      strokeLinecap: 'round', opacity: 0.9,
      d: `M${112 * s} ${74 * s} q${18 * s} ${-14 * s} ${2 * s} ${-26 * s} q${-12 * s} ${-9 * s} ${-26 * s} ${-2 * s}`,
    }));
    push('paw', React.createElement('path', {
      key: 'paw', fill: 'none', stroke: line, strokeWidth: 1.4, opacity: 0.5,
      d: `M${58 * s} ${86 * s} q${8 * s} ${5 * s} ${18 * s} 0`,
    }));
  }

  if (posture === 'waking') {
    /* sitting up, ears half raised, sleepy half-shut eyes */
    push('body', React.createElement('path', {
      key: 'body', fill: coat, stroke: line, strokeWidth: 1.6,
      d: `M${44 * s} ${104 * s} q${-8 * s} ${-34 * s} ${10 * s} ${-46 * s}
          q${22 * s} ${-13 * s} ${40 * s} ${2 * s} q${16 * s} ${16 * s} ${8 * s} ${44 * s} Z`,
    }));
    push('head', React.createElement('ellipse', {
      key: 'head', cx: 66 * s, cy: 48 * s, rx: 24 * s, ry: 21 * s,
      fill: coat, stroke: line, strokeWidth: 1.6,
    }));
    push('earL', React.createElement('path', {
      key: 'earL', fill: coat, stroke: line, strokeWidth: 1.4,
      d: cat ? `M${47 * s} ${34 * s} l${1 * s} ${-17 * s} l${15 * s} ${11 * s} Z`
             : `M${46 * s} ${34 * s} q${-11 * s} ${6 * s} ${-3 * s} ${20 * s} q${10 * s} ${-4 * s} ${11 * s} ${-16 * s} Z`,
    }));
    push('earR', React.createElement('path', {
      key: 'earR', fill: coat, stroke: line, strokeWidth: 1.4,
      d: cat ? `M${85 * s} ${34 * s} l${-1 * s} ${-17 * s} l${-15 * s} ${11 * s} Z`
             : `M${86 * s} ${34 * s} q${11 * s} ${6 * s} ${3 * s} ${20 * s} q${-10 * s} ${-4 * s} ${-11 * s} ${-16 * s} Z`,
    }));
    ['L', 'R'].forEach((side, i) => push('eye' + side, React.createElement('path', {
      key: 'eye' + side, fill: 'none', stroke: line, strokeWidth: 1.7, strokeLinecap: 'round',
      d: `M${(55 + i * 18) * s} ${47 * s} q${4 * s} ${5 * s} ${8 * s} 0`,
    })));
    push('brow', React.createElement('path', {
      key: 'brow', fill: 'none', stroke: line, strokeWidth: 1.2, opacity: 0.5, strokeLinecap: 'round',
      d: `M${54 * s} ${40 * s} q${5 * s} ${-3 * s} ${9 * s} ${-1 * s} M${73 * s} ${39 * s} q${5 * s} ${-2 * s} ${9 * s} ${1 * s}`,
    }));
    push('nose', React.createElement('circle', { key: 'nose', cx: 66 * s, cy: 56 * s, r: 2.4 * s, fill: line, opacity: 0.8 }));
    push('tail', React.createElement('path', {
      key: 'tail', fill: 'none', stroke: line, strokeWidth: cat ? 5 * s : 7 * s, strokeLinecap: 'round',
      d: `M${100 * s} ${100 * s} q${20 * s} ${-6 * s} ${14 * s} ${-26 * s}`,
    }));
  }

  if (posture === 'walking') {
    /* legs first, then one silhouette that carries body + neck + head, then the
       pack sitting proud of the back line with a strap crossing the shoulder */
    const legs = [[44, -4], [52, 4], [74, -4], [82, 5]];
    legs.forEach(([lx, dx], i) => push('leg' + i, React.createElement('path', {
      key: 'leg' + i, className: `dt-leg dt-leg-${i % 2}`, fill: 'none', stroke: line,
      strokeWidth: 4.2 * s, strokeLinecap: 'round',
      d: `M${lx * s} ${64 * s} l${dx * s} ${16 * s}`,
    })));
    push('silhouette', React.createElement('path', {
      key: 'silhouette', fill: coat, stroke: line, strokeWidth: 1.6, strokeLinejoin: 'round',
      /* rump → back → shoulder → neck → skull → muzzle → jaw → chest → belly */
      d: `M${32 * s} ${58 * s}
          q${-2 * s} ${-16 * s} ${16 * s} ${-18 * s}
          q${18 * s} ${-2 * s} ${30 * s} ${-1 * s}
          q${8 * s} ${-1 * s} ${12 * s} ${-8 * s}
          q${5 * s} ${-8 * s} ${14 * s} ${-4 * s}
          q${9 * s} ${4 * s} ${8 * s} ${13 * s}
          l${9 * s} ${2 * s} q${3 * s} ${1 * s} ${0 * s} ${3 * s}
          l${-10 * s} ${2 * s}
          q${-2 * s} ${7 * s} ${-11 * s} ${7 * s}
          q${-9 * s} ${0 * s} ${-13 * s} ${5 * s}
          q${-12 * s} ${5 * s} ${-38 * s} ${2 * s}
          q${-16 * s} ${-1 * s} ${-17 * s} ${-3 * s} Z`,
    }));
    push('ear', React.createElement('path', {
      key: 'ear', fill: coat, stroke: line, strokeWidth: 1.3, strokeLinejoin: 'round',
      d: cat ? `M${96 * s} ${38 * s} l${-3 * s} ${-17 * s} l${15 * s} ${11 * s} Z`
             : `M${97 * s} ${33 * s} q${-12 * s} ${5 * s} ${-5 * s} ${19 * s} q${12 * s} ${-4 * s} ${11 * s} ${-17 * s} Z`,
    }));
    push('eye', React.createElement('circle', {
      key: 'eye', cx: 106 * s, cy: 39 * s, r: 1.8 * s, fill: line,
    }));
    push('nose', React.createElement('circle', {
      key: 'nose', cx: 119 * s, cy: 44 * s, r: 1.6 * s, fill: line, opacity: 0.85,
    }));
    push('strap', React.createElement('path', {
      key: 'strap', fill: 'none', stroke: line, strokeWidth: 1.3, opacity: 0.75,
      d: `M${64 * s} ${42 * s} q${4 * s} ${9 * s} ${1 * s} ${16 * s}`,
    }));
    push('pack', React.createElement('path', {
      key: 'pack', fill: 'var(--dt-clay)', stroke: line, strokeWidth: 1.4, strokeLinejoin: 'round',
      /* sits above the spine: lid, body, then a flap line */
      d: `M${46 * s} ${40 * s} q${2 * s} ${-13 * s} ${16 * s} ${-13 * s}
          q${14 * s} ${0 * s} ${15 * s} ${13 * s}
          q${-15 * s} ${6 * s} ${-31 * s} ${0 * s} Z`,
    }));
    push('flap', React.createElement('path', {
      key: 'flap', fill: 'none', stroke: line, strokeWidth: 1.1, opacity: 0.6,
      d: `M${49 * s} ${33 * s} q${13 * s} ${5 * s} ${25 * s} ${0 * s}`,
    }));
    push('tail', React.createElement('path', {
      key: 'tail', fill: 'none', stroke: line, strokeWidth: cat ? 4.5 * s : 6.5 * s, strokeLinecap: 'round',
      d: `M${33 * s} ${50 * s} q${-17 * s} ${-5 * s} ${-15 * s} ${-21 * s}`,
    }));
  }
  return g;
}

function Pet({ kind = 'dog', coat = 'var(--dt-coat)', line = 'var(--dt-ink)', posture = 'curled',
               width = 150, scale = 1, zzz = false, breathe = false, style }) {
  const h = posture === 'walking' ? 96 : posture === 'waking' ? 118 : 104;
  return (
    <svg viewBox={`0 0 ${140 * scale} ${h * scale}`} width={width} role="img"
      aria-label={`${kind}, ${posture}`} style={{ display: 'block', overflow: 'visible', ...style }}>
      <g className={breathe ? 'dt-breathe' : undefined}>{petParts(kind, coat, line, posture, scale)}</g>
      {zzz && [0, 1, 2].map(i => (
        <text key={i} className="dt-zzz" x={(108 + i * 13) * scale} y={(40 - i * 12) * scale}
          style={{ animationDelay: `${i * 0.9}s` }}
          fontFamily="var(--font-mono)" fontSize={(11 + i * 3) * scale} fill="var(--dt-ink)" opacity="0.5">z</text>
      ))}
    </svg>
  );
}

/* ── the trail: one session drawn as ground covered ────────────────────────── */
function Trail({ width = 300, height = 116, progress = 0.62, landscape = 'lane',
                 kind = 'dog', coat = 'var(--dt-coat)', pet = true, label, style }) {
  const id = ++defsId;
  const r = R(landscape.length * 97 + 5);
  const y = height - 30;
  const scene = {
    lane: [{ y: 0.3, h: 0.2, fill: 'var(--dt-mint)', opacity: 0.5, blobs: 3 },
           { y: 0.62, h: 0.1, fill: 'var(--dt-sand)', opacity: 0.4, blobs: 2 }],
    desert: [{ y: 0.28, h: 0.22, fill: 'var(--dt-dusk)', opacity: 0.6, blobs: 3 },
             { y: 0.66, h: 0.12, fill: 'var(--dt-sand)', opacity: 0.6, blobs: 3 }],
    peaks: [{ y: 0.3, h: 0.24, fill: 'var(--dt-slate)', opacity: 0.45, blobs: 4 },
            { y: 0.68, h: 0.1, fill: 'var(--dt-mist)', opacity: 0.6, blobs: 2 }],
  }[landscape] || [];
  const marks = [];
  for (let i = 0; i < 16; i++) {
    const mx = 10 + r() * (width - 20);
    marks.push(React.createElement('path', {
      key: 'm' + i, fill: 'none', stroke: 'var(--dt-ink)', strokeWidth: 1, opacity: 0.16,
      d: `M${mx.toFixed(1)} ${(y + 6 + r() * 12).toFixed(1)} l${(3 + r() * 7).toFixed(1)} 0`,
    }));
  }
  if (landscape === 'desert') for (let i = 0; i < 10; i++) marks.push(React.createElement('circle', {
    key: 's' + i, cx: (14 + r() * (width - 28)).toFixed(1), cy: (12 + r() * 44).toFixed(1),
    r: (0.8 + r() * 0.9).toFixed(1), fill: 'var(--dt-ink)', opacity: 0.35,
  }));
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" role="img" aria-label={label || landscape}
      style={{ display: 'block', height: 'auto', ...style }}>
      <Defs id={id} />
      {wash(id, width, height, scene, landscape.length + 3)}
      {marks}
      <line x1="10" y1={y} x2={width - 10} y2={y} stroke="var(--dt-ink)" strokeWidth="1" opacity="0.35" />
      <line x1="10" y1={y} x2={10 + (width - 20) * progress} y2={y}
        stroke="var(--dt-gold)" strokeWidth="3.2" strokeLinecap="round" filter={`url(#glow-${id})`} />
      {pet && <g transform={`translate(${10 + (width - 20) * progress - 68}, ${y - 55})`}>
        {petParts(kind, coat, 'var(--dt-ink)', 'walking', 0.62)}
      </g>}
      {!pet && <circle cx={10 + (width - 20) * progress} cy={y} r="3.4"
        fill="var(--dt-gold)" stroke="var(--dt-paper)" strokeWidth="1" />}
    </svg>
  );
}

/* ── the globe: a year of route on a pastel world ─────────────────────────── */
function Globe({ size = 250, seed = 4, style }) {
  const id = ++defsId;
  const c = size / 2, rad = size * 0.42, r = R(seed * 313 + 7);
  const lands = [];
  for (let i = 0; i < 5; i++) {
    const a = r() * Math.PI * 2, d = rad * (0.15 + r() * 0.55);
    lands.push(React.createElement('ellipse', {
      key: 'l' + i, cx: (c + Math.cos(a) * d).toFixed(1), cy: (c + Math.sin(a) * d * 0.8).toFixed(1),
      rx: (rad * (0.18 + r() * 0.26)).toFixed(1), ry: (rad * (0.12 + r() * 0.2)).toFixed(1),
      fill: 'var(--dt-mint)', opacity: 0.55, filter: `url(#wc-${id})`,
    }));
  }
  const grid = [];
  for (let i = 1; i < 5; i++) {
    const k = i / 5;
    grid.push(React.createElement('ellipse', {
      key: 'g' + i, cx: c, cy: c, rx: (rad * Math.sin(Math.PI * k)).toFixed(1), ry: rad,
      fill: 'none', stroke: 'var(--dt-ink)', strokeWidth: 0.7, opacity: 0.16,
    }));
    grid.push(React.createElement('line', {
      key: 'h' + i, x1: c - rad * Math.sin(Math.acos(2 * k - 1)), x2: c + rad * Math.sin(Math.acos(2 * k - 1)),
      y1: c - rad + 2 * rad * k, y2: c - rad + 2 * rad * k,
      stroke: 'var(--dt-ink)', strokeWidth: 0.7, opacity: 0.16,
    }));
  }
  /* the route: a wandering arc with waypoint dots */
  let d = `M${(c - rad * 0.72).toFixed(1)} ${(c + rad * 0.42).toFixed(1)}`;
  const pts = [];
  for (let i = 1; i <= 5; i++) {
    const px = c - rad * 0.72 + (rad * 1.44) * (i / 5) + (r() - 0.5) * 14;
    const py = c + rad * 0.42 - rad * 0.9 * (i / 5) + (r() - 0.5) * 26;
    pts.push([px, py]);
    d += ` Q${(px - 12).toFixed(1)} ${(py + 14).toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)}`;
  }
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" role="img" aria-label="A year of route"
      style={{ display: 'block', height: 'auto', ...style }}>
      <Defs id={id} />
      <circle cx={c} cy={c} r={rad * 1.16} fill="var(--dt-dusk)" opacity="0.28" filter={`url(#wc-soft-${id})`} />
      <circle cx={c} cy={c} r={rad} fill="var(--dt-sky)" stroke="var(--dt-ink)" strokeWidth="1" strokeOpacity="0.3" />
      {lands}{grid}
      <path d={d} fill="none" stroke="var(--dt-gold)" strokeWidth="2.2" strokeLinecap="round"
        filter={`url(#glow-${id})`} />
      {pts.map(([px, py], i) =>
        <circle key={'p' + i} cx={px.toFixed(1)} cy={py.toFixed(1)} r={i === pts.length - 1 ? 3.6 : 2.2}
          fill="var(--dt-gold)" stroke="var(--dt-paper)" strokeWidth="1" />)}
    </svg>
  );
}

/* ── a postcard: unlocked place + a note from the pet ─────────────────────── */
function Postcard({ place, note, landscape = 'lane', locked = false, kind = 'dog', style }) {
  const id = ++defsId;
  const w = 150, h = 96;
  const scene = {
    lane: [{ y: 0.34, h: 0.24, fill: 'var(--dt-mint)', opacity: 0.55, blobs: 2 }],
    desert: [{ y: 0.3, h: 0.26, fill: 'var(--dt-sand)', opacity: 0.6, blobs: 2 }],
    peaks: [{ y: 0.32, h: 0.28, fill: 'var(--dt-slate)', opacity: 0.45, blobs: 3 }],
    city: [{ y: 0.36, h: 0.22, fill: 'var(--dt-clay)', opacity: 0.45, blobs: 3 }],
  }[landscape];
  return (
    <div style={{
      background: 'var(--dt-paper)', border: '1px solid var(--dt-line)', borderRadius: 12,
      padding: 8, display: 'flex', flexDirection: 'column', gap: 7,
      opacity: locked ? 0.42 : 1, ...style,
    }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" role="img" aria-label={place}
        style={{ display: 'block', height: 'auto', borderRadius: 8, background: 'var(--dt-sky)' }}>
        <Defs id={id} />
        {!locked && wash(id, w, h, scene, place.length + 2)}
        <line x1="8" y1={h - 22} x2={w - 8} y2={h - 22} stroke="var(--dt-ink)" strokeWidth="1" opacity="0.28" />
        {!locked && <g transform={`translate(${w - 62}, ${h - 22 - 80 * 0.44})`}>
          {petParts(kind, 'var(--dt-coat)', 'var(--dt-ink)', 'walking', 0.44)}
        </g>}
        {locked && <text x={w / 2} y={h / 2 + 4} textAnchor="middle" fontFamily="var(--font-mono)"
          fontSize="9" letterSpacing="2" fill="var(--dt-ink)" opacity="0.45">LOCKED</text>}
      </svg>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '.16em',
        textTransform: 'uppercase', color: 'var(--dt-ink-2)',
      }}>{place}</div>
      {!locked && <div style={{
        fontFamily: 'var(--font-display)', fontSize: 11.5, lineHeight: 1.45, color: 'var(--dt-ink)',
      }}>{note}</div>}
    </div>
  );
}
