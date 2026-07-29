/* FocusFlow iOS — screen shell helpers, Today and Proposal. */
const { Button, Chip, SegmentedControl, Rule, Headline, Label, Note, Numeral,
        StatRow, BulletItem, Timeline, Countdown, StatusBar, TabBar,
        Tree, Grove, BreathRing, ShareArt, PhoneFrame } = FF;

const TABS = [{ value: 'today', label: 'Today' }, { value: 'grove', label: 'Grove' }, { value: 'connect', label: 'You' }];

function Screen({ children, theme, keyId }) {
  return (
    <div key={keyId} className="ff-arrive" data-theme={theme}
      style={{
        display: 'flex', flexDirection: 'column', height: '100%',
        background: theme ? 'var(--paper)' : undefined, color: theme ? 'var(--ink-1)' : undefined,
      }}>{children}</div>
  );
}

function Body({ children, center, style }) {
  return <div className="ff-scroll" style={{
    flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
    justifyContent: center ? 'center' : 'flex-start', ...style,
  }}>{children}</div>;
}

const Pad = ({ children, style }) => <div style={{ padding: '0 30px', ...style }}>{children}</div>;

/* ---------------------------------------------------------------- TODAY -- */
function TodayScreen({ go }) {
  return (
    <Screen keyId="today">
      <StatusBar time="9:41" />
      <Body>
        <Pad style={{ paddingTop: 26, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <Label>Next · 18:00</Label>
            <Headline size="l" style={{ marginTop: 14 }}>Review<br />chapter 3</Headline>
            <Countdown text="in 12 min" seconds={720} />
            <Note style={{ marginTop: 12 }}>50 minutes, ending 18:50.</Note>
          </div>
          <div style={{ flex: '0 0 96px', textAlign: 'center', marginTop: 44 }}>
            <Tree stage={3} green={2} size={1.5} seed={4} width={96} height={132} />
            <Label size="xs" style={{ marginTop: 6 }}>today</Label>
          </div>
        </Pad>
        <Pad>
          <Button style={{ marginTop: 20 }} onClick={() => go('focus')}>Start</Button>
          <Button variant="tiny">Not now</Button>
          <Rule />
          <Label style={{ marginBottom: 14 }}>Rest of today</Label>
          <Timeline items={[
            { time: '08:30', name: 'Rewrite lecture notes', state: 'done' },
            { time: '10:00', name: 'Problem set 6', state: 'done' },
            { time: '18:00', name: 'Review chapter 3', state: 'now' },
            { time: '19:00', name: 'Free time' },
            { time: '21:00', name: 'Wind down' },
          ]} />
          <Rule />
          <Button variant="inline" onClick={() => go('plan')}>ChatGPT proposed 26 blocks · review</Button>
          <div style={{ height: 26 }} />
        </Pad>
      </Body>
      <TabBar tabs={TABS} current="today" onChange={go} />
    </Screen>
  );
}

/* ------------------------------------------------------------- PROPOSAL -- */
function ProposalScreen({ go }) {
  return (
    <Screen keyId="plan">
      <StatusBar time="9:41" />
      <Body>
        <Pad style={{ paddingTop: 28 }}>
          <Label>From ChatGPT · 2 min ago</Label>
          <Headline size="m" style={{ marginTop: 14 }}>26 blocks,<br />1–14 September.</Headline>
          <Note style={{ marginTop: 12 }}>Nothing is scheduled and nothing is locked until you approve.</Note>
          <Rule />
          <Timeline items={[
            { time: 'Tue', name: 'Review chapter 3 · 50 min' },
            { time: 'Wed', name: 'Problem set 6 · 50 min' },
            { time: 'Wed', name: 'Flashcards, unit 2 · 25 min' },
            { time: '+23', name: <span style={{ color: 'var(--ink-3)' }}>See the rest</span> },
          ]} />
          <Rule />
          <BulletItem tone="caution">Sunday is your rest day — 4 blocks moved to Saturday.</BulletItem>
          <BulletItem tone="caution">Thursday runs three hours without a break.</BulletItem>
          <BulletItem>Calls, Maps, bank and 2FA stay open throughout.</BulletItem>
          <div style={{ marginTop: 20 }}>
            <Button onClick={() => go('today')}>Approve</Button>
            <Button variant="tiny">Send back with fixes</Button>
          </div>
          <div style={{ height: 20 }} />
        </Pad>
      </Body>
      <TabBar tabs={TABS} current="today" onChange={go} />
    </Screen>
  );
}

Object.assign(window, { Screen, Body, Pad, TABS, TodayScreen, ProposalScreen });
