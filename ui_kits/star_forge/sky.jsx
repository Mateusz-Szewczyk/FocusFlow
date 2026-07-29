/* Star Forge — the sky layer.

   THE MODEL, in one line each:
     SIZE     = tasks finished that day
     LIGHT    = how well the plan was kept (never dark, only misty)
     COLOUR   = the project the day belonged to — so a year is legible at a glance
     ARTIFACT = a rare, earned form: ring (every block kept), binary (two projects
                held in balance), comet (came back after a break), wisp (rest day)
     NOVA     = seven kept nights in a row. Rare, named, permanent.

   Drawn with radial gradients and plain circles; one blur filter per svg, CSS for
   motion, so a sky full of stars stays cheap. */

const R = FF.rng;
let sfId = 0;

/* ── colour carries meaning: one hue per project ───────────────────────────── */
const PROJECTS = [
  { id: 'thesis',  name: 'Thesis',   bright: '#DCE8FF', deep: '#8FA9EC' },
  { id: 'finance', name: 'Finance',  bright: '#FFE9BE', deep: '#F0BC6B' },
  { id: 'rewrite', name: 'Rewrite',  bright: '#E7DCFF', deep: '#A78CF0' },
  { id: 'reading', name: 'Reading',  bright: '#D8F4EC', deep: '#7FCBB6' },
  { id: 'admin',   name: 'Admin',    bright: '#FFDCE6', deep: '#E894AF' },
];
const BY_ID = {};
PROJECTS.forEach(p => { BY_ID[p.id] = p; });

function hueOf(project) {
  const p = BY_ID[project] || PROJECTS[0];
  return [p.bright, p.deep];
}

function StarDefs({ id, project = 'thesis', clarity = 1 }) {
  const [bright, deep] = hueOf(project);
  return (
    <defs>
      <radialGradient id={`sf-core-${id}`}>
        <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.35 + clarity * 0.65} />
        <stop offset=".38" stopColor={bright} stopOpacity={0.5 + clarity * 0.5} />
        <stop offset="1" stopColor={deep} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`sf-halo-${id}`}>
        <stop offset="0" stopColor={bright} stopOpacity={0.4 * clarity} />
        <stop offset=".6" stopColor={deep} stopOpacity={0.15 * clarity} />
        <stop offset="1" stopColor={deep} stopOpacity="0" />
      </radialGradient>
      <filter id={`sf-blur-${id}`} x="-70%" y="-70%" width="240%" height="240%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
      <filter id={`sf-soft-${id}`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="2.4" />
      </filter>
    </defs>
  );
}

/* ── one star, plus its artifact if it earned one ──────────────────────────── */
function starNodes(id, cx, cy, d, opts = {}) {
  const { mass = 0.5, project = 'thesis', artifact = null } = d;
  const clarity = d.clarity == null ? 0.7 : d.clarity;
  const r = (4 + mass * 15) * (opts.boost || 1);
  const [bright, deep] = hueOf(project);
  const out = [];

  /* a rest day is a wisp: present, unlit, never a gap in the sky */
  if (artifact === 'wisp') {
    out.push(React.createElement('ellipse', {
      key: 'wisp', cx, cy, rx: r * 2.2, ry: r * 1.1, fill: bright,
      opacity: 0.2, filter: `url(#sf-blur-${id})`,
    }));
    out.push(React.createElement('circle', { key: 'seed', cx, cy, r: Math.max(1, r * 0.16), fill: '#FFFFFF', opacity: 0.5 }));
    return out;
  }

  /* came back after a break: the star arrives with a tail */
  if (artifact === 'comet') {
    for (let i = 0; i < 3; i++) out.push(React.createElement('path', {
      key: 'tail' + i, fill: 'none', stroke: bright, strokeLinecap: 'round',
      strokeWidth: (r * (0.5 - i * 0.14)).toFixed(2), opacity: (0.34 - i * 0.09).toFixed(2),
      filter: `url(#sf-soft-${id})`,
      d: `M${cx - r * 0.4} ${cy + r * 0.2} Q${cx - r * (4 + i)} ${cy + r * (1.1 + i * 0.5)} ${cx - r * (8 + i * 2)} ${cy + r * (2.4 + i)}`,
    }));
  }

  out.push(React.createElement('circle', {
    key: 'halo', cx, cy, r: r * (3.1 + clarity * 1.4), fill: `url(#sf-halo-${id})`,
  }));
  if (clarity < 0.72) out.push(React.createElement('circle', {
    key: 'haze', cx, cy, r: r * 2.8, fill: bright,
    opacity: (0.3 * (1 - clarity)).toFixed(2), filter: `url(#sf-blur-${id})`,
  }));
  out.push(React.createElement('circle', {
    key: 'core', cx, cy, r: r * 1.9, fill: `url(#sf-core-${id})`,
    className: opts.pulse ? 'sf-pulse' : undefined,
  }));
  out.push(React.createElement('circle', {
    key: 'nucleus', cx, cy, r: Math.max(1, r * 0.42), fill: '#FFFFFF',
    opacity: (0.55 + clarity * 0.45).toFixed(2),
  }));

  const rays = opts.rays === false ? 0 : 4 + Math.round(mass * 4);
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2 + 0.2;
    const len = r * (1.7 + clarity * 2.6) * (i % 2 ? 0.6 : 1);
    out.push(React.createElement('line', {
      key: 'ray' + i, x1: cx + Math.cos(a) * r * 0.8, y1: cy + Math.sin(a) * r * 0.8,
      x2: cx + Math.cos(a) * len, y2: cy + Math.sin(a) * len,
      stroke: bright, strokeWidth: 1, strokeLinecap: 'round',
      opacity: (0.22 + clarity * 0.5).toFixed(2), filter: `url(#sf-soft-${id})`,
    }));
  }

  /* every planned block kept → a ring. The one artifact people will chase. */
  if (artifact === 'ring') {
    out.push(React.createElement('g', {
      key: 'ring', transform: `rotate(-19 ${cx} ${cy})`, className: opts.spin ? 'sf-tilt' : undefined,
    }, [
      React.createElement('ellipse', {
        key: 'r1', cx, cy, rx: r * 3.1, ry: r * 0.9, fill: 'none',
        stroke: bright, strokeWidth: 1.2, opacity: 0.85,
      }),
      React.createElement('ellipse', {
        key: 'r2', cx, cy, rx: r * 3.8, ry: r * 1.1, fill: 'none',
        stroke: deep, strokeWidth: 0.8, opacity: 0.45,
      }),
    ]));
  }

  /* two projects held in balance → a binary pair */
  if (artifact === 'binary') {
    const [b2] = hueOf(d.project2 || 'reading');
    out.push(React.createElement('circle', {
      key: 'b-halo', cx: cx + r * 2.4, cy: cy - r * 1.2, r: r * 1.7,
      fill: b2, opacity: 0.22, filter: `url(#sf-blur-${id})`,
    }));
    out.push(React.createElement('circle', {
      key: 'b-core', cx: cx + r * 2.4, cy: cy - r * 1.2, r: Math.max(1, r * 0.5),
      fill: '#FFFFFF', opacity: 0.85,
    }));
    out.push(React.createElement('ellipse', {
      key: 'b-orbit', cx: cx + r * 1.2, cy: cy - r * 0.6, rx: r * 2.4, ry: r * 0.9,
      fill: 'none', stroke: b2, strokeWidth: 0.7, opacity: 0.3,
      transform: `rotate(-26 ${cx + r * 1.2} ${cy - r * 0.6})`,
    }));
  }
  return out;
}

function Star({ mass = 0.6, clarity = 0.85, project = 'thesis', artifact = null, project2,
                size = 200, pulse = false, spin = true, style }) {
  const id = ++sfId;
  const c = size / 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" role="img"
      aria-label={`${project} star, ${Math.round(mass * 100)}% size, ${Math.round(clarity * 100)}% clarity`}
      style={{ display: 'block', height: 'auto', overflow: 'visible', ...style }}>
      <StarDefs id={id} project={project} clarity={clarity} />
      {starNodes(id, c, c, { mass, clarity, project, artifact, project2 }, { pulse, spin })}
    </svg>
  );
}

/* ── the forge: a star being made, fed by drifting dust ────────────────────── */
function Forge({ size = 300, mass = 0.5, clarity = 0.9, project = 'finance',
                 stalled = false, style }) {
  const id = ++sfId;
  const c = size / 2, r = R(project.length * 191 + 3);
  const [bright, deep] = hueOf(project);
  const motes = [];
  for (let i = 0; i < 16; i++) {
    const a = r() * Math.PI * 2, dist = c * (0.72 + r() * 0.3);
    const x = c + Math.cos(a) * dist, y = c * 0.86 + Math.sin(a) * dist;
    motes.push(React.createElement('circle', {
      key: 'm' + i, className: 'sf-mote', cx: x.toFixed(1), cy: y.toFixed(1),
      r: (0.9 + r() * 2.1).toFixed(1), fill: bright,
      style: {
        '--sf-dx': `${(c - x).toFixed(1)}px`, '--sf-dy': `${(c * 0.86 - y).toFixed(1)}px`,
        animationDelay: `${(r() * 7).toFixed(2)}s`,
        animationDuration: `${(7 + r() * 5).toFixed(2)}s`,
      },
    }));
  }
  const field = [];
  for (let i = 0; i < 40; i++) field.push(React.createElement('circle', {
    key: 'f' + i, cx: (r() * size).toFixed(1), cy: (r() * size).toFixed(1),
    r: (0.5 + r() * 0.9).toFixed(1), fill: '#FFFFFF', opacity: (0.1 + r() * 0.3).toFixed(2),
    className: 'sf-twinkle', style: { animationDelay: `${(r() * 6).toFixed(2)}s` },
  }));
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" role="img" aria-label="A star being forged"
      className={stalled ? 'sf-stalled' : undefined}
      style={{ display: 'block', height: 'auto', ...style }}>
      <StarDefs id={id} project={project} clarity={clarity} />
      {field}
      <g className="sf-swirl" style={{ transformOrigin: `${c}px ${c * 0.86}px` }}>
        <ellipse cx={c} cy={c * 0.86} rx={c * 0.78} ry={c * 0.3} fill="none"
          stroke={deep} strokeWidth="1" opacity=".18" />
        <ellipse cx={c} cy={c * 0.86} rx={c * 0.52} ry={c * 0.2} fill="none"
          stroke={bright} strokeWidth="1" opacity=".14" />
      </g>
      <g className="sf-dust">{motes}</g>
      <g>{starNodes(id, c, c * 0.86, { mass, clarity, project }, { pulse: true, boost: 2.3 })}</g>
    </svg>
  );
}

/* ── the nova: seven kept nights, fused. The rarest thing in the app. ──────── */
function Nova({ size = 300, project = 'thesis', reveal = true, style }) {
  const id = ++sfId;
  const c = size / 2;
  const [bright, deep] = hueOf(project);
  const rays = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const len = c * (i % 2 ? 0.42 : 0.78);
    rays.push(React.createElement('line', {
      key: 'r' + i, x1: c + Math.cos(a) * c * 0.1, y1: c + Math.sin(a) * c * 0.1,
      x2: c + Math.cos(a) * len, y2: c + Math.sin(a) * len,
      stroke: i % 2 ? deep : bright, strokeWidth: i % 2 ? 0.9 : 1.4, strokeLinecap: 'round',
      opacity: i % 2 ? 0.4 : 0.75, filter: `url(#sf-soft-${id})`,
    }));
  }
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" role="img" aria-label="A nova"
      style={{ display: 'block', height: 'auto', overflow: 'visible', ...style }}>
      <StarDefs id={id} project={project} clarity={1} />
      <circle cx={c} cy={c} r={c * 0.92} fill={`url(#sf-halo-${id})`} opacity=".9" />
      {[0, 1, 2].map(i => (
        <circle key={'shock' + i} className={reveal ? 'sf-shock' : undefined} cx={c} cy={c}
          r={c * 0.28} fill="none" stroke={bright} strokeWidth="1"
          style={{ animationDelay: `${i * 1.6}s` }} opacity={reveal ? 0 : 0.2} />
      ))}
      <g className={reveal ? 'sf-flare' : undefined} style={{ transformOrigin: `${c}px ${c}px` }}>
        {rays}
        <g className="sf-tilt-slow" style={{ transformOrigin: `${c}px ${c}px` }}>
          <ellipse cx={c} cy={c} rx={c * 0.66} ry={c * 0.19} fill="none" stroke={bright}
            strokeWidth="1.4" opacity=".8" transform={`rotate(-19 ${c} ${c})`} />
          <ellipse cx={c} cy={c} rx={c * 0.8} ry={c * 0.24} fill="none" stroke={deep}
            strokeWidth="0.9" opacity=".45" transform={`rotate(-19 ${c} ${c})`} />
        </g>
        <circle cx={c} cy={c} r={c * 0.2} fill={`url(#sf-core-${id})`} className="sf-pulse" />
        <circle cx={c} cy={c} r={c * 0.075} fill="#FFFFFF" />
      </g>
    </svg>
  );
}

/* ── the sky: past days, plus the novae that came out of them ──────────────── */
function Sky({ days, width = 320, height = 280, seed = 11, constellation = null,
               onPick, selected, style }) {
  const id = ++sfId;
  const r = R(seed * 353 + 9);
  const pts = days.map((d, i) => {
    const t = i / Math.max(1, days.length - 1);
    const a = t * Math.PI * 2.4 + r() * 0.3;
    const rad = (0.12 + t * 0.3) * Math.min(width, height);
    return {
      ...d, i,
      x: width / 2 + Math.cos(a) * rad * 1.32 + (r() - 0.5) * 14,
      y: height / 2 + Math.sin(a) * rad * 0.95 + (r() - 0.5) * 12,
    };
  });
  const dust = [];
  for (let i = 0; i < 70; i++) dust.push(React.createElement('circle', {
    key: 'd' + i, cx: (r() * width).toFixed(1), cy: (r() * height).toFixed(1),
    r: (0.4 + r() * 0.8).toFixed(1), fill: '#FFFFFF', opacity: (0.08 + r() * 0.24).toFixed(2),
    className: 'sf-twinkle', style: { animationDelay: `${(r() * 7).toFixed(2)}s` },
  }));
  const lines = [];
  if (constellation) constellation.edges.forEach(([a, b], k) => {
    const p = pts[a], q = pts[b];
    if (!p || !q) return;
    const live = p.unlocked !== false && q.unlocked !== false;
    lines.push(React.createElement('line', {
      key: 'c' + k, x1: p.x, y1: p.y, x2: q.x, y2: q.y,
      stroke: live ? '#CBD8FF' : '#6C74A0', strokeWidth: live ? 1.1 : 0.8,
      strokeDasharray: live ? undefined : '3 5', opacity: live ? 0.75 : 0.4,
      className: live ? 'sf-draw' : undefined,
      style: live ? { animationDelay: `${0.25 + k * 0.22}s` } : undefined,
    }));
  });
  /* each of the sky's own defs are per-project, so a star paints its own gradient */
  const perProject = {};
  pts.forEach(p => { perProject[p.project] = true; });
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" role="img" aria-label="Your sky"
      style={{ display: 'block', height: 'auto', ...style }}>
      {Object.keys(perProject).map(pr =>
        <StarDefs key={pr} id={`${id}-${pr}`} project={pr} clarity={1} />)}
      {dust}{lines}
      {pts.map(p => (
        <g key={p.label} onClick={onPick ? () => onPick(p.label) : undefined}
          style={{ cursor: onPick ? 'pointer' : 'default' }}>
          {p.unlocked === false
            ? <circle cx={p.x} cy={p.y} r="4.5" fill="none" stroke="#7C84B4" strokeWidth="1"
                strokeDasharray="2 3" opacity=".7" />
            : starNodes(`${id}-${p.project}`, p.x, p.y, p,
                { rays: p.mass > 0.5, pulse: selected === p.label, boost: 0.34 })}
          {selected === p.label && <circle cx={p.x} cy={p.y} r={20} fill="none"
            stroke="#CBD8FF" strokeWidth="1" opacity=".8" />}
        </g>
      ))}
    </svg>
  );
}

/* ── the cosmos: a year, coloured by what the year was actually about ──────── */
function Cosmos({ size = 320, count = 340, seed = 23, zoom = true, mix, style }) {
  const id = ++sfId;
  const c = size / 2, r = R(seed * 617 + 13);
  const weights = mix || [0.34, 0.24, 0.18, 0.14, 0.1];
  const pick = () => {
    let x = r(), i = 0;
    while (i < weights.length - 1 && x > weights[i]) { x -= weights[i]; i++; }
    return PROJECTS[i].bright;
  };
  const arms = 3, nodes = [];
  for (let i = 0; i < count; i++) {
    const arm = i % arms;
    const t = (i / count) ** 0.62;
    const a = t * 5.6 + (arm / arms) * Math.PI * 2 + (r() - 0.5) * 0.5;
    const rad = t * c * 0.92 * (0.9 + r() * 0.2);
    const x = c + Math.cos(a) * rad, y = c + Math.sin(a) * rad * 0.62;
    nodes.push(React.createElement('circle', {
      key: 'n' + i, cx: x.toFixed(1), cy: y.toFixed(1),
      r: (0.6 + r() * 2.4 * (1 - t * 0.4)).toFixed(1), fill: pick(),
      opacity: (0.35 + r() * 0.6).toFixed(2),
      className: r() > 0.72 ? 'sf-twinkle' : undefined,
      style: r() > 0.72 ? { animationDelay: `${(r() * 8).toFixed(2)}s` } : undefined,
    }));
  }
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" role="img" aria-label="A year of stars"
      style={{ display: 'block', height: 'auto', ...style }}>
      <StarDefs id={id} project="thesis" clarity={1} />
      <ellipse cx={c} cy={c} rx={c * 0.95} ry={c * 0.62} fill={`url(#sf-halo-${id})`} opacity=".7" />
      <g className={zoom ? 'sf-zoom' : undefined} style={{ transformOrigin: `${c}px ${c}px` }}>
        <g className="sf-spin-slow" style={{ transformOrigin: `${c}px ${c}px` }}>{nodes}</g>
        <circle cx={c} cy={c} r={c * 0.1} fill="#FFF8E8" opacity=".9" filter={`url(#sf-soft-${id})`} />
      </g>
    </svg>
  );
}

/* ── week meter: the positive tension. Seven nights, then a nova. ─────────── */
function WeekMeter({ kept = [true, true, true, false, true, true, null], project = 'thesis', style }) {
  const [bright] = hueOf(project);
  const done = kept.filter(k => k === true).length;
  const perfect = kept.every(k => k === true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, ...style }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {kept.map((k, i) => (
          <span key={i} style={{
            flex: 1, height: 3, borderRadius: 3,
            background: k === true ? bright : k === false ? 'rgba(190,203,255,.22)' : 'rgba(190,203,255,.1)',
            boxShadow: k === true ? `0 0 9px ${bright}` : 'none',
            transition: 'background .4s, box-shadow .4s',
          }} />
        ))}
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.16em',
        textTransform: 'uppercase', color: 'var(--sf-ink-2)',
      }}>
        {perfect ? 'Seven of seven · nova' : `${done} of 7 nights kept · nova at seven`}
      </div>
    </div>
  );
}

/* ── legend: five hues, one line. The only key the app needs. ─────────────── */
function Legend({ style }) {
  return (
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', ...style }}>
      {PROJECTS.map(p => (
        <span key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 7, height: 7, borderRadius: 999, background: p.bright,
            boxShadow: `0 0 7px ${p.bright}`,
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.14em',
            textTransform: 'uppercase', color: 'var(--sf-ink-3)',
          }}>{p.name}</span>
        </span>
      ))}
    </div>
  );
}
