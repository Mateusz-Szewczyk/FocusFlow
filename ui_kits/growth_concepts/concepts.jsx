/* Three ways to visualise a month of protected time, drawn with system tokens.
   Nothing here is production yet — it exists so we can choose a metaphor. */

const { Headline, Label, Note, Rule, Chip, Numeral, BulletItem } = FF;
const rand = FF.rng;

/* ── shared month data: twelve months of a plausible year ──────────────────── */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const YEAR = MONTHS.map((m, i) => {
  const r = rand(i * 977 + 13);
  const kept = 0.34 + r() * 0.62;          /* kept ÷ planned */
  return {
    month: m, kept,
    hours: Math.round(18 + kept * 46),      /* hours protected */
    steady: 0.25 + r() * 0.7,               /* how evenly the month ran */
    rest: Math.round(2 + r() * 6),
    abandoned: r() > 0.72,
  };
});

function tone(kept) {
  return kept > 0.74 ? 'var(--accent)' : kept > 0.5 ? 'var(--leaf)' : 'var(--ink-3)';
}

/* ══ 1a — BONSAI OF THE MONTH ══════════════════════════════════════════════ */
/* One tree per month, and you keep working the same tree all month: trunk taper
   from hours held, pad count and fullness from things finished, pad balance from
   how steadily the month ran, colour from kept ÷ planned. A bad month is not a
   dead tree, it is an unshaped one. */
function bonsaiNodes(d, o) {
  const { w, h, size, detail } = o;
  const r = rand(MONTHS.indexOf(d.month) * 613 + 29);
  const back = [], front = [];
  const potH = 15 * size, base = h - potH - 9 * size;
  const cx = w * 0.5;
  const trunkH = Math.min(h * 0.58, (58 + d.hours * 0.5 + d.kept * 26) * size);
  const pads = Math.max(3, Math.round(2.4 + d.kept * 2.6));
  const leafC = tone(d.kept);
  const lift = 1 - d.steady * 0.5;

  /* trunk: three lengths, each leaning the other way. A steady month stands up. */
  const segs = 3, pts = [[cx, base]];
  let lean = r() > 0.5 ? 1 : -1, x = cx, y = base;
  for (let i = 0; i < segs; i++) {
    y -= (trunkH / segs) * (1 - i * 0.08);
    x += lean * (9 + r() * 9) * lift * (1 - i * 0.18) * size;
    pts.push([x, y]);
    lean *= -1;
  }

  /* pads: flat clouds carried out to one side, smaller as they step up, plus an
     apex pad over the crown. Drawn behind the trunk so the trunk stays legible. */
  for (let p = 0; p < pads; p++) {
    const apex = p === pads - 1;
    const t = p / (pads - 1);
    const seg = 1 + t * (segs - 1);
    const i0 = Math.floor(seg), f = seg - i0;
    const px = pts[i0][0] + ((pts[Math.min(segs, i0 + 1)][0] - pts[i0][0]) * f);
    const py = pts[i0][1] + ((pts[Math.min(segs, i0 + 1)][1] - pts[i0][1]) * f);
    const side = apex ? 0 : (p % 2 ? 1 : -1);
    const reach = (20 + 13 * d.kept) * (1 - t * 0.42) * size * (apex ? 0.72 : 1);
    const rx = reach, ry = reach * 0.31;
    const ox = px + side * reach * 0.72, oy = py - (apex ? reach * 0.5 : 5 * size);
    if (!apex) back.push(React.createElement('path', {
      key: 'br' + p, fill: 'none', stroke: 'var(--ink-2)', strokeWidth: (1.3 * size).toFixed(2),
      strokeLinecap: 'round', opacity: 0.5,
      d: `M${px.toFixed(1)} ${py.toFixed(1)} Q${(px + side * reach * 0.4).toFixed(1)} ${(py - 1).toFixed(1)} ${ox.toFixed(1)} ${(oy + ry * 0.3).toFixed(1)}`,
    }));
    back.push(React.createElement('ellipse', {
      key: 'pad' + p, cx: ox.toFixed(1), cy: oy.toFixed(1), rx: rx.toFixed(1), ry: ry.toFixed(1),
      fill: leafC, fillOpacity: (0.09 + d.kept * 0.13).toFixed(2),
      stroke: leafC, strokeWidth: 1, strokeOpacity: 0.6,
    }));
    if (detail) {
      const ticks = Math.round(5 + d.kept * 5);
      for (let i = 0; i < ticks; i++) {
        const a = Math.PI + (0.12 + (i / (ticks - 1)) * 0.76) * Math.PI;
        const tx = ox + Math.cos(a) * rx * 0.9, ty = oy + Math.sin(a) * ry * 0.95;
        back.push(React.createElement('path', {
          key: `lf${p}_${i}`, fill: 'none', stroke: leafC, strokeWidth: 1,
          strokeLinecap: 'round', opacity: 0.75,
          d: `M${tx.toFixed(1)} ${ty.toFixed(1)} l${(Math.cos(a) * 3.4 * size).toFixed(1)} ${(Math.sin(a) * 3.4 * size).toFixed(1)}`,
        }));
      }
    }
  }

  for (let i = 0; i < segs; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    front.push(React.createElement('path', {
      key: 'tr' + i, fill: 'none', stroke: 'var(--ink-1)', strokeLinecap: 'round',
      strokeWidth: ((5.2 - i * 1.3) * size * (0.72 + d.hours / 150)).toFixed(2),
      d: `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${(x1 + (x2 - x1) * 0.1).toFixed(1)} ${((y1 + y2) / 2).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`,
    }));
  }

  /* jin: a bleached stub where the month left blocks abandoned — kept, never hidden */
  if (d.abandoned) {
    const [jx, jy] = pts[1];
    front.push(React.createElement('path', {
      key: 'jin', fill: 'none', stroke: 'var(--ink-3)', strokeWidth: (1.8 * size).toFixed(2),
      strokeLinecap: 'round', opacity: 0.75,
      d: `M${jx.toFixed(1)} ${jy.toFixed(1)} q${(-7 * size).toFixed(1)} ${(-6 * size).toFixed(1)} ${(-13 * size).toFixed(1)} ${(-6 * size).toFixed(1)}`,
    }));
  }

  /* moss for rest days, then the pot */
  const pw = (44 + d.hours * 0.26) * size;
  if (detail) for (let i = 0; i < d.rest; i++) {
    const mx = cx + (r() - 0.5) * pw * 0.7;
    front.push(React.createElement('path', {
      key: 'ms' + i, fill: 'none', stroke: 'var(--leaf)', strokeWidth: 1, opacity: 0.55,
      d: `M${(mx - 3).toFixed(1)} ${(base - 1).toFixed(1)} q3 -2.4 6 0`,
    }));
  }
  front.push(React.createElement('path', {
    key: 'pot', fill: 'var(--paper-raised)', stroke: 'var(--ink-2)', strokeWidth: 1,
    d: `M${(cx - pw / 2).toFixed(1)} ${base.toFixed(1)} L${(cx + pw / 2).toFixed(1)} ${base.toFixed(1)} ` +
       `L${(cx + pw / 2 - 6 * size).toFixed(1)} ${(base + potH).toFixed(1)} ` +
       `L${(cx - pw / 2 + 6 * size).toFixed(1)} ${(base + potH).toFixed(1)} Z`,
  }));
  front.push(React.createElement('line', {
    key: 'rim', x1: (cx - pw / 2 - 4 * size).toFixed(1), x2: (cx + pw / 2 + 4 * size).toFixed(1),
    y1: (base + 2.5 * size).toFixed(1), y2: (base + 2.5 * size).toFixed(1),
    stroke: 'var(--ink-2)', strokeWidth: 1,
  }));
  return back.concat(front);
}

function Bonsai({ data, width = 220, height = 260, size = 1, detail = true, style }) {
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" role="img"
      aria-label={`${data.month}: ${data.hours} hours protected`}
      style={{ display: 'block', height: 'auto', ...style }}>
      {bonsaiNodes(data, { w: width, h: height, size, detail })}
    </svg>
  );
}

/* ══ 1b — THE RAKED GARDEN ══════════════════════════════════════════════════ */
/* A month is a courtyard seen from above. Every day you protect sets a stone;
   the rake lines are the routine that holds them together, and they break where
   the month broke. No growth, no dying, no plant guilt — composition instead. */
function Garden({ data, width = 300, height = 210, style }) {
  const r = rand(MONTHS.indexOf(data.month) * 421 + 5);
  const out = [];
  const stones = Math.max(4, Math.round(4 + data.kept * 10));
  const lines = 11;
  for (let i = 0; i < lines; i++) {
    const y = 18 + (i / (lines - 1)) * (height - 36);
    const broken = r() > 0.42 + data.steady * 0.48;
    const d = broken
      ? `M12 ${y.toFixed(1)} Q${width * 0.26} ${(y - 3).toFixed(1)} ${(width * 0.42).toFixed(1)} ${y.toFixed(1)} ` +
        `M${(width * 0.6).toFixed(1)} ${y.toFixed(1)} Q${width * 0.82} ${(y + 3).toFixed(1)} ${(width - 12).toFixed(1)} ${y.toFixed(1)}`
      : `M12 ${y.toFixed(1)} Q${width / 2} ${(y - 3.5 + r() * 7).toFixed(1)} ${(width - 12).toFixed(1)} ${y.toFixed(1)}`;
    out.push(React.createElement('path', {
      key: 'rk' + i, d, fill: 'none', stroke: 'var(--ink-3)', strokeWidth: 1,
      opacity: broken ? 0.3 : 0.55,
    }));
  }
  /* stones sit on a jittered grid so a good month reads as a composition, not spatter */
  const cols = 4, rows = Math.ceil(stones / cols);
  for (let i = 0; i < stones; i++) {
    const c = i % cols, row = Math.floor(i / cols);
    const sx = 26 + (c + 0.5) * ((width - 52) / cols) + (r() - 0.5) * 18;
    const sy = 28 + (row + 0.5) * ((height - 56) / rows) + (r() - 0.5) * 12;
    const rr = 7 + r() * 8 * (0.5 + data.kept);
    out.push(React.createElement('ellipse', {
      key: 'st' + i, cx: sx.toFixed(1), cy: sy.toFixed(1), rx: rr.toFixed(1), ry: (rr * 0.74).toFixed(1),
      fill: 'var(--paper)', stroke: 'var(--ink-1)', strokeWidth: 1, strokeOpacity: 0.75,
    }));
    if (r() > 0.55) out.push(React.createElement('path', {
      key: 'mo' + i, fill: 'none', stroke: tone(data.kept), strokeWidth: 1.2, opacity: 0.85,
      d: `M${(sx - rr * 0.7).toFixed(1)} ${(sy + rr * 0.42).toFixed(1)} q${(rr * 0.7).toFixed(1)} -3 ${(rr * 1.4).toFixed(1)} 0`,
    }));
  }
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" role="img"
      aria-label={`${data.month}: ${stones} stones set`}
      style={{ display: 'block', height: 'auto', background: 'var(--paper-raised)', ...style }}>
      <rect x="5" y="5" width={width - 10} height={height - 10} fill="none"
        stroke="var(--hairline)" strokeWidth="1" />
      {out}
    </svg>
  );
}

/* ══ 1c — THE WOVEN MONTH ══════════════════════════════════════════════════ */
/* The month is cloth. Warp is the week, weft is each day: a thick pick for a day
   held, a thin one for a day that slipped, undyed thread for rest. Twelve months
   make a bolt of fabric you can read from across the room. */
function Weave({ data, width = 300, height = 210, style }) {
  const r = rand(MONTHS.indexOf(data.month) * 733 + 11);
  const cols = 7, rows = 5, out = [];
  const cw = (width - 24) / cols, ch = (height - 24) / rows;
  for (let row = 0; row < rows; row++) {
    for (let c = 0; c < cols; c++) {
      const q = r();
      const rest = q > 0.88;
      const held = !rest && q < data.kept;
      const y0 = 12 + row * ch;
      const picks = rest ? 2 : held ? 4 : 3;
      const th = (ch * 0.82) / picks;
      const gap = (ch - th * picks) / 2;
      for (let p = 0; p < picks; p++) {
        out.push(React.createElement('line', {
          key: `p${row}_${c}_${p}`, x1: 12 + c * cw, x2: 12 + (c + 1) * cw,
          y1: (y0 + gap + th * (p + 0.5)).toFixed(1), y2: (y0 + gap + th * (p + 0.5)).toFixed(1),
          stroke: rest ? 'var(--ink-3)' : held ? tone(data.kept) : 'var(--ink-3)',
          strokeWidth: (th * (rest ? 0.4 : held ? 0.92 : 0.55)).toFixed(1),
          opacity: rest ? 0.3 : held ? 0.92 : 0.5,
        }));
      }
    }
  }
  /* warp on top, so the picks read as passing under the threads */
  for (let c = 0; c <= cols; c++) out.push(React.createElement('line', {
    key: 'w' + c, x1: 12 + c * cw, x2: 12 + c * cw, y1: 10, y2: height - 10,
    stroke: 'var(--paper-raised)', strokeWidth: 2.6, opacity: 0.9,
  }));
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" role="img"
      aria-label={`${data.month} woven`}
      style={{ display: 'block', height: 'auto', background: 'var(--sheet)', ...style }}>{out}</svg>
  );
}

/* ── page furniture ───────────────────────────────────────────────────────── */
function Option({ id, name, claim, why, risk, hero, strip }) {
  return (
    <article id={id} style={{
      background: 'var(--paper)', border: '1px solid var(--hairline)',
      borderRadius: 20, padding: '26px 26px 30px', display: 'flex',
      flexDirection: 'column', gap: 18, minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em',
          textTransform: 'uppercase', color: 'var(--accent-on)', background: 'var(--accent)',
          padding: '4px 8px', borderRadius: 999,
        }}>{id}</span>
        <Headline size="s">{name}</Headline>
      </div>
      <Note size="sm" style={{ margin: 0 }}>{claim}</Note>
      <div style={{ background: 'var(--sheet)', border: '1px solid var(--hairline)', borderRadius: 14, padding: 14 }}>
        {hero}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>{strip}</div>
      <Rule gap={2} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <BulletItem>{why}</BulletItem>
        <BulletItem tone="caution">{risk}</BulletItem>
      </div>
    </article>
  );
}

function MonthCell({ label, children }) {
  return (
    <div style={{ minWidth: 0 }}>
      {children}
      <Label size="xs" style={{ marginTop: 5, textAlign: 'center' }}>{label}</Label>
    </div>
  );
}

function Concepts() {
  const [pick, setPick] = React.useState('Nov');
  const cur = YEAR.find(y => y.month === pick);
  return (
    <React.Fragment>
      <header style={{ padding: '78px 32px 34px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <Label size="lg" style={{ marginBottom: 22 }}>Turn 1 · growth metaphor</Label>
          <Headline size="xl" style={{ marginBottom: 18, maxWidth: '26ch' }}>
            Three ways to show a month you kept
          </Headline>
          <Note size="lg" style={{ maxWidth: '62ch' }}>
            Same data in all three: hours protected, things finished, kept ÷ planned, how
            steadily the month ran, rest days, blocks abandoned. What changes is the object
            that holds it — and how far it stands from a forest of focus trees.
          </Note>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 28 }}>
            {YEAR.map(y =>
              <Chip key={y.month} selected={y.month === pick} onClick={() => setPick(y.month)}>{y.month}</Chip>)}
          </div>
          <Note size="sm" style={{ marginTop: 14 }}>
            {pick}: <b>{cur.hours} h</b> protected · {Math.round(cur.kept * 100)}% of plan kept ·
            {' '}{cur.rest} rest days{cur.abandoned ? ' · blocks abandoned' : ''}
          </Note>
        </div>
      </header>

      <section style={{ padding: '10px 32px 90px' }}>
        <div style={{
          maxWidth: 1240, margin: '0 auto', display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 22, alignItems: 'start',
        }}>
          <Option id="1a" name="Bonsai of the month"
            claim="One tree per month, worked all month. Trunk thickens with hours held; pads multiply with things finished; the lean straightens the steadier you run; a bleached stub marks blocks abandoned. Twelve pots on a shelf per year."
            why="Slow, deliberate, and about shaping rather than collecting — a bonsai is never finished, so there is nothing to lose."
            risk="Still a tree: closest of the three to a focus-forest app, and a month is a long feedback loop."
            hero={<Bonsai data={cur} />}
            strip={YEAR.map(y =>
              <MonthCell key={y.month} label={y.month}>
                <Bonsai data={y} width={110} height={140} size={0.52} detail={false} />
              </MonthCell>)} />

          <Option id="1b" name="The raked garden"
            claim="A month is a courtyard from above. Each day you protect sets a stone; the rake lines are the routine holding them, and they break where the month broke. Moss where you rested."
            why="No plants, no growth, no death — nothing to feel guilty about, and a composition reads instantly at thumbnail size."
            risk="Abstract: users may not intuit that a stone equals a day without a legend."
            hero={<Garden data={cur} />}
            strip={YEAR.map(y =>
              <MonthCell key={y.month} label={y.month}>
                <Garden data={y} width={150} height={110} />
              </MonthCell>)} />

          <Option id="1c" name="The woven month"
            claim="The month is cloth. Warp is the week, weft is the day: a thick pick for a day held, a thin one for a day that slipped, undyed thread for rest. A year is a bolt of fabric."
            why="Furthest from any focus app, honest about bad stretches without punishing them, and it tiles beautifully into a year or a shareable print."
            risk="Least emotional pull — no living thing to care for, so streak motivation is weaker."
            hero={<Weave data={cur} />}
            strip={YEAR.map(y =>
              <MonthCell key={y.month} label={y.month}>
                <Weave data={y} width={150} height={110} />
              </MonthCell>)} />
        </div>
      </section>

      <section style={{ background: 'var(--room)', borderTop: '1px solid var(--room-hairline)', padding: '70px 32px 86px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Headline size="m" style={{ marginBottom: 14 }}>On the Forest comparison</Headline>
          <Note size="md">
            The overlap with Forest is the loop, not the drawing: plant on start, lose it if
            you leave. Our grove never punishes — a rest day is planted, an abandoned block
            leaves a scar rather than a corpse — but a daily tree that appears when a timer
            runs will still read as the same idea to anyone who has seen it.
          </Note>
          <Note size="md">
            The distance comes from three moves: (1) the object is <b>worked</b> over weeks
            instead of spawned per session, (2) the unit is a month, not a 25-minute timer,
            and (3) what varies is <b>shape and composition</b>, not survival. <a href="#1a">1a</a>{' '}
            takes move 1, <a href="#1b">1b</a> and <a href="#1c">1c</a> take all three.
          </Note>
          <Rule gap={22} />
          <Numeral size="sm" tone="secondary">RECOMMENDATION</Numeral>
          <Note size="md">
            Ship <a href="#1a">1a</a> as the app's living object and <a href="#1c">1c</a> as
            the year in review and the shareable — a bonsai answers "how am I doing this
            month", cloth answers "what did my year look like", and neither needs a forest.
          </Note>
        </div>
      </section>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Concepts />);
