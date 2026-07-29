/* FocusFlow marketing page — every element comes from the design system.
   Layout only lives here: the page is a column of full-width bands. */

const { Button, Headline, Label, Note, Numeral, Rule, SegmentedControl,
        StatRow, BulletItem, Tree, Grove, ShareArt } = FF;

const HOW = [
  ['01', 'Plan the day out loud', 'Tell your assistant what the day holds. It writes the blocks and holds them until you approve.'],
  ['02', 'Protect the block', 'One primary action, a fifteen-second breath, and nothing to watch while the time passes.'],
  ['03', 'Plant the day', 'At the close, the day becomes a tree. Nothing dies, rest is planted.'],
];

const PRICE = [
  ['Free', '£0', ['One tree a day', 'The week row', 'Two assistants'], 'quiet'],
  ['Pro', '£4 / mo', ['The month stand and the year', 'Share art at any size', 'Unlimited assistants', 'Locks that hold'], 'primary'],
];

function Band({ children, tone = 'paper', style }) {
  return (
    <section style={{
      background: tone === 'room' ? 'var(--room)' : 'var(--paper)',
      borderTop: tone === 'room' ? '1px solid var(--room-hairline)' : '1px solid var(--hairline)',
      padding: '96px 32px', ...style,
    }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>{children}</div>
    </section>
  );
}

function Hero() {
  return (
    <section style={{ padding: '112px 32px 88px', background: 'var(--paper)' }}>
      <div style={{
        maxWidth: 1080, margin: '0 auto', display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1fr) minmax(280px, 420px)',
        gap: 64, alignItems: 'center',
      }}>
        <div>
          <Label size="lg" style={{ marginBottom: 26 }}>FocusFlow · plan, protect, grow</Label>
          <Headline size="xl" style={{ marginBottom: 22 }}>
            A day becomes a tree.<br />A year becomes a forest.
          </Headline>
          <Note size="lg" style={{ maxWidth: '46ch', marginBottom: 34 }}>
            A calendar that grows what you keep. Blocks are written by your assistant,
            approved by you, and planted at the end of the day — height for hours held,
            leaves for work finished.
          </Note>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', maxWidth: 420 }}>
            <Button style={{ width: 'auto', padding: '16px 34px' }}>Get FocusFlow</Button>
            <Button variant="inline">See the growth rule</Button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', paddingRight: 28 }}>
          <Tree stage={5} green={2} size={1.8} width={340} height={380} animate={false} />
        </div>
      </div>
    </section>
  );
}

function GrowthBand() {
  const stages = [
    [0, '0', 'seedling'], [1, '1', 'one block'], [2, '2', 'two'],
    [3, '3', 'three'], [4, '4', 'five'], [5, '5', 'eight'],
  ];
  return (
    <Band tone="room">
      <Headline size="l" style={{ marginBottom: 12 }}>Growth costs the two before it</Headline>
      <Note size="md" style={{ maxWidth: '54ch', marginBottom: 44 }}>
        Fibonacci steps: 1 · 1 · 2 · 3 · 5 · 8. Early wins feel large and grinding pays
        less and less — the shape of the tree tells you when to stop.
      </Note>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 18, alignItems: 'end' }}>
        {stages.map(([stage, n, caption]) => (
          <div key={n} style={{ textAlign: 'center' }}>
            <Tree stage={stage} green={2} size={1.25} seed={stage * 7 + 3}
              width={140} height={190} animate={false} />
            <Label size="xs" style={{ marginTop: 10 }}>{caption}</Label>
          </div>
        ))}
      </div>
    </Band>
  );
}

function HowBand() {
  return (
    <Band>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 52 }}>
        {HOW.map(([n, title, body]) => (
          <div key={n}>
            <Numeral size="sm" tone="secondary">{n}</Numeral>
            <Rule gap={16} />
            <Headline size="s" style={{ marginBottom: 10 }}>{title}</Headline>
            <Note size="sm">{body}</Note>
          </div>
        ))}
      </div>
    </Band>
  );
}

function ProofBand() {
  const [view, setView] = React.useState('week');
  return (
    <Band tone="room">
      <div style={{
        display: 'grid', gridTemplateColumns: 'minmax(260px, 360px) 1fr',
        gap: 56, alignItems: 'start',
      }}>
        <div>
          <Headline size="l" style={{ marginBottom: 14 }}>The year, read at a glance</Headline>
          <Note size="md" style={{ marginBottom: 24 }}>
            A week is a row you can read. A month is a stand with the newest week in front.
            A year is twelve stands on one horizon.
          </Note>
          <SegmentedControl value={view} onChange={setView} options={[
            { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' }]} />
          <div style={{ marginTop: 30 }}>
            <StatRow label="Height" value="431 h protected" />
            <StatRow label="Leaves" value="612 things finished" />
            <StatRow label="Colour" value="87% of your plan" last />
          </div>
        </div>
        <div style={{
          background: 'var(--paper)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-card, 18px)', padding: 26, overflow: 'hidden',
        }}>
          <Grove view={view} animate={false} />
          <Label size="xs" style={{ marginTop: 14 }}>Your grove · {view}</Label>
        </div>
      </div>
    </Band>
  );
}

function ShareBand() {
  return (
    <Band>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(280px, 380px)', gap: 60, alignItems: 'center' }}>
        <div>
          <Headline size="l" style={{ marginBottom: 14 }}>Share the forest, not the to-do list</Headline>
          <Note size="md" style={{ maxWidth: '48ch', marginBottom: 20 }}>
            Export art of the year at any size. Trees, days and totals only — never task
            names, never times, never an app badge you have to apologise for.
          </Note>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 460 }}>
            <BulletItem>Calls, Maps, bank and 2FA stay open during a lock.</BulletItem>
            <BulletItem tone="caution">Assistants may read the grove. They may never open a lock.</BulletItem>
          </div>
        </div>
        <ShareArt format="post" title="2026" subtitle="208 days planted" />
      </div>
    </Band>
  );
}

function PriceBand() {
  return (
    <Band tone="room">
      <Headline size="l" style={{ marginBottom: 40 }}>Free plants a tree a day</Headline>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 420px))', gap: 26 }}>
        {PRICE.map(([name, price, lines, variant]) => (
          <div key={name} style={{
            background: 'var(--paper)', border: '1px solid var(--hairline)',
            borderRadius: 'var(--radius-card, 18px)', padding: '30px 28px 26px',
            display: 'flex', flexDirection: 'column', gap: 18,
          }}>
            <div>
              <Label size="sm">{name}</Label>
              <Numeral size="md" style={{ marginTop: 6 }}>{price}</Numeral>
            </div>
            <Rule gap={0} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              {lines.map(l => <BulletItem key={l}>{l}</BulletItem>)}
            </div>
            <Button variant={variant}>{name === 'Pro' ? 'Start Pro' : 'Use Free'}</Button>
          </div>
        ))}
      </div>
    </Band>
  );
}

function Foot() {
  return (
    <footer style={{
      background: 'var(--paper)', borderTop: '1px solid var(--hairline)',
      padding: '54px 32px 70px',
    }}>
      <div style={{
        maxWidth: 1080, margin: '0 auto', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap',
      }}>
        <Label size="sm">FocusFlow · nothing dies, rest is planted</Label>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Growth rule', 'Assistants', 'Privacy', 'Support'].map(l =>
            <Button key={l} variant="inline">{l}</Button>)}
        </div>
      </div>
    </footer>
  );
}

function Page() {
  return (
    <React.Fragment>
      <Hero />
      <GrowthBand />
      <HowBand />
      <ProofBand />
      <ShareBand />
      <PriceBand />
      <Foot />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Page />);
