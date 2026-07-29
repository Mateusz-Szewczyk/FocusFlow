/* Dream Traveler — the screens. Product logic is unchanged from the grove build:
   the assistant writes blocks over MCP, you approve them, a session locks the
   phone, progress accumulates. What changed is the object that carries it: a
   sleeping pet and the ground you cover together. */

const { Button, Chip, SegmentedControl, Rule, Headline, Label, Note, Numeral,
        StatRow, BulletItem, Timeline, Countdown, StatusBar, TabBar, PhoneFrame } = FF;

const TABS = [{ value: 'today', label: 'Today' }, { value: 'journey', label: 'Journey' },
              { value: 'connect', label: 'You' }];

/* ── screen chrome ────────────────────────────────────────────────────────── */
function Screen({ children, mood = 'day', pad = true, style }) {
  return (
    <div data-dt-mood={mood} style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      background: 'var(--dt-paper)', color: 'var(--dt-ink)',
      fontFamily: 'var(--font-body)', overflow: 'hidden',
      transition: 'background .5s', ...style,
    }}>{children}</div>
  );
}

function Body({ children, center = false, style }) {
  return (
    <div className="ff-scroll" style={{
      flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
      justifyContent: center ? 'center' : 'flex-start', minHeight: 0, ...style,
    }}>{children}</div>
  );
}

const Pad = ({ children, style }) =>
  <div style={{ padding: '0 26px', ...style }}>{children}</div>;

/* washes painted behind a whole screen */
function Backdrop({ mood = 'day', children }) {
  const scenes = {
    day: [{ y: 0.12, h: 0.16, fill: 'var(--dt-sky)', opacity: 0.9, blobs: 2 },
          { y: 0.9, h: 0.12, fill: 'var(--dt-mint)', opacity: 0.4, blobs: 2 }],
    dusk: [{ y: 0.16, h: 0.24, fill: 'var(--dt-dusk)', opacity: 0.75, blobs: 3 },
           { y: 0.78, h: 0.16, fill: 'var(--dt-slate)', opacity: 0.5, blobs: 2 }],
    alert: [{ y: 0.2, h: 0.22, fill: 'var(--dt-clay)', opacity: 0.5, blobs: 3 },
            { y: 0.84, h: 0.14, fill: 'var(--dt-sand)', opacity: 0.45, blobs: 2 }],
  }[mood];
  const id = 900 + Object.keys(scenes).length + mood.length;
  return (
    <React.Fragment>
      <svg viewBox="0 0 340 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <Defs id={id} />
        {wash(id, 340, 720, scenes, mood.length * 5 + 2)}
      </svg>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {children}
      </div>
    </React.Fragment>
  );
}

/* ══ 1 · ONBOARDING ═══════════════════════════════════════════════════════ */
const BREEDS = {
  dog: ['Shiba', 'Corgi', 'Lurcher'],
  cat: ['Shorthair', 'Ragdoll', 'Siamese'],
};
const COATS = [
  ['var(--dt-coat-cream)', 'Cream'], ['var(--dt-coat-honey)', 'Honey'],
  ['var(--dt-coat-ash)', 'Ash'], ['var(--dt-coat-ink)', 'Soot'],
];

function OnboardingScreen({ go }) {
  const [kind, setKind] = React.useState('dog');
  const [breed, setBreed] = React.useState('Shiba');
  const [coat, setCoat] = React.useState(COATS[1][0]);
  const pick = k => { setKind(k); setBreed(BREEDS[k][0]); };
  return (
    <Screen>
      <Backdrop mood="day">
        <StatusBar time="9:41" />
        <Body>
          <Pad style={{ paddingTop: 12 }}>
            <Label size="sm">Step 1 of 3</Label>
            <Headline size="m" style={{ margin: '10px 0 6px' }}>Who is travelling with you?</Headline>
            <Note size="sm">They will sleep while you work, and walk while you rest.</Note>
          </Pad>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '20px 26px 0' }}>
            {['dog', 'cat'].map(k => (
              <button key={k} onClick={() => pick(k)} style={{
                cursor: 'pointer', border: `1px solid ${kind === k ? 'var(--dt-ink)' : 'var(--dt-line)'}`,
                background: kind === k ? 'var(--dt-paper-raised)' : 'transparent',
                borderRadius: 18, padding: '14px 10px 10px', display: 'flex',
                flexDirection: 'column', alignItems: 'center', gap: 6,
                transition: 'border-color .25s, background .25s',
              }}>
                <Pet kind={k} posture="curled" coat={coat} width={116} scale={0.9} />
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.18em',
                  textTransform: 'uppercase', color: kind === k ? 'var(--dt-ink)' : 'var(--dt-ink-2)',
                }}>{k}</span>
              </button>
            ))}
          </div>

          <Pad style={{ paddingTop: 24 }}>
            <Label size="xs" style={{ marginBottom: 9 }}>Breed</Label>
            <SegmentedControl value={breed} onChange={setBreed}
              options={BREEDS[kind].map(b => ({ value: b, label: b }))} />

            <Label size="xs" style={{ margin: '22px 0 9px' }}>Coat</Label>
            <div style={{ display: 'flex', gap: 10 }}>
              {COATS.map(([c, name]) => (
                <button key={c} onClick={() => setCoat(c)} aria-label={name} style={{
                  cursor: 'pointer', width: 42, height: 42, borderRadius: 999, background: c,
                  border: `2px solid ${coat === c ? 'var(--dt-ink)' : 'transparent'}`,
                  boxShadow: 'inset 0 0 0 1px var(--dt-line)', transition: 'border-color .2s',
                }} />
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '24px 0 4px' }}>
              <Label size="xs">Name</Label>
              <div style={{
                flex: 1, borderBottom: '1px solid var(--dt-line)', paddingBottom: 6,
                fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--dt-ink)',
              }}>Luna<span className="dt-caret">|</span></div>
            </div>
          </Pad>

          <Pad style={{ padding: '26px 26px 22px' }}>
            <Button onClick={() => go('today')}>Set out together</Button>
            <Button variant="tiny" onClick={() => go('today')}>Skip · choose later</Button>
          </Pad>
        </Body>
      </Backdrop>
    </Screen>
  );
}

/* ══ 2 · TODAY ════════════════════════════════════════════════════════════ */
function TodayScreen({ go }) {
  return (
    <Screen>
      <Backdrop mood="day">
        <StatusBar time="9:41" />
        <Body>
          <Pad style={{ paddingTop: 14 }}>
            <Label size="sm">Next · 18:00</Label>
            <Headline size="l" style={{ margin: '10px 0 8px' }}>Review chapter 3</Headline>
            <Note size="sm">50 minutes. Luna will sleep through all of it.</Note>
            <Countdown text="in 12 min" seconds={720} />
          </Pad>

          <div style={{ display: 'flex', justifyContent: 'center', padding: '18px 0 2px' }}>
            <Pet kind="dog" posture="curled" width={200} breathe zzz />
          </div>
          <Pad>
            <Note size="sm" style={{ textAlign: 'center', color: 'var(--dt-ink-2)' }}>
              Luna is napping until you start.
            </Note>
          </Pad>

          <Pad style={{ paddingTop: 20 }}>
            <Rule gap={0} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '14px 0 0' }}>
              <StatRow label="Today" value="2.4 km walked" />
              <StatRow label="This week" value="14.8 km" last />
            </div>
            <Button variant="inline" onClick={() => go('plan')} style={{ marginTop: 14 }}>
              Claude proposed 26 blocks · review
            </Button>
          </Pad>

          <Pad style={{ padding: '22px 26px 20px' }}>
            <Button onClick={() => go('focus')}>Start · let her sleep</Button>
          </Pad>
        </Body>
        <TabBar tabs={TABS} current="today" onChange={v => go(v === 'journey' ? 'journey' : 'connect')} />
      </Backdrop>
    </Screen>
  );
}

/* ══ 3 · PROPOSAL (MCP) ═══════════════════════════════════════════════════ */
function ProposalScreen({ go }) {
  return (
    <Screen>
      <Backdrop mood="day">
        <StatusBar time="9:42" />
        <Body>
          <Pad style={{ paddingTop: 14 }}>
            <Label size="sm">Written by Claude over MCP</Label>
            <Headline size="m" style={{ margin: '10px 0 8px' }}>26 blocks, held for approval</Headline>
            <Note size="sm">Nothing is on your calendar and Luna does not sleep until you say yes.</Note>
            <Timeline items={[
              { time: '08:30', name: 'Rewrite lecture notes', state: 'done' },
              { time: '10:00', name: 'Problem set 6', state: 'done' },
              { time: '18:00', name: 'Review chapter 3', state: 'now' },
              { time: '19:00', name: 'Free time', state: 'todo' },
            ]} />
          </Pad>
          <Pad style={{ paddingTop: 18 }}>
            <Rule gap={0} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 14 }}>
              <BulletItem>Two long blocks moved off your commute.</BulletItem>
              <BulletItem tone="caution">Thursday runs three hours without a break.</BulletItem>
            </div>
          </Pad>
          <Pad style={{ padding: '24px 26px 20px' }}>
            <Button onClick={() => go('today')}>Approve the day</Button>
            <Button variant="quiet" style={{ marginTop: 9 }} onClick={() => go('today')}>Adjust two blocks</Button>
          </Pad>
        </Body>
      </Backdrop>
    </Screen>
  );
}

/* ══ 4 · FOCUS — DEEP SLEEP ═══════════════════════════════════════════════ */
function SleepScreen({ go }) {
  return (
    <Screen mood="dusk">
      <Backdrop mood="dusk">
        <StatusBar time="18:12" />
        <Body center style={{ textAlign: 'center' }}>
          <Pad>
            <Label size="xs" style={{ marginBottom: 18, color: 'var(--dt-ink-2)' }}>Shh · deep sleep</Label>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Pet kind="dog" posture="curled" width={230} breathe zzz />
            </div>
            <Numeral size="lg" style={{ marginTop: 26 }}>37:48</Numeral>
            <Note size="sm" style={{ marginTop: 8, color: 'var(--dt-ink-2)' }}>
              until 18:50 · Luna is dreaming of the coast road
            </Note>
            <Rule gap={26} />
            <Note size="sm" style={{ color: 'var(--dt-ink-2)' }}>
              Calls, Maps, bank and 2FA stay open. Everything else waits.
            </Note>
          </Pad>
        </Body>
        <Pad style={{ paddingBottom: 18 }}>
          <Button variant="tiny" onClick={() => go('stirred')}>Wake her early</Button>
        </Pad>
      </Backdrop>
    </Screen>
  );
}

/* ══ 5 · DISTURBANCE ══════════════════════════════════════════════════════ */
function StirredScreen({ go }) {
  return (
    <Screen mood="alert">
      <Backdrop mood="alert">
        <StatusBar time="18:14" />
        <Body center style={{ textAlign: 'center' }}>
          <Pad>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Pet kind="dog" posture="waking" width={190} />
            </div>
            <Headline size="m" style={{ marginTop: 20 }}>Luna stirred</Headline>
            <Note size="md" style={{ marginTop: 10 }}>
              She lifted her head when the phone moved. Nothing is lost — settle her
              back and the walk carries on.
            </Note>
            <Numeral size="sm" tone="secondary" style={{ marginTop: 18 }}>36 MIN LEFT</Numeral>
          </Pad>
        </Body>
        <Pad style={{ paddingBottom: 20 }}>
          <Button onClick={() => go('focus')}>Back to sleep</Button>
          <Button variant="tiny" onClick={() => go('journey')}>End here · she walks what you kept</Button>
        </Pad>
      </Backdrop>
    </Screen>
  );
}

/* ══ 6 · BLOCKED APP ══════════════════════════════════════════════════════ */
function BlockedScreen({ go }) {
  return (
    <Screen mood="dusk">
      <Backdrop mood="dusk">
        <StatusBar time="18:28" />
        <Body center style={{ textAlign: 'center' }}>
          <Pad>
            <Numeral size="lg">22:04</Numeral>
            <Note size="sm" style={{ marginTop: 8, color: 'var(--dt-ink-2)' }}>
              before this app opens again
            </Note>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
              <Pet kind="dog" posture="curled" width={150} breathe />
            </div>
            <Note size="sm" style={{ marginTop: 16, color: 'var(--dt-ink-2)' }}>
              Luna is still asleep.
            </Note>
          </Pad>
        </Body>
        <Pad style={{ paddingBottom: 18 }}>
          <Button variant="tiny" onClick={() => go('focus')}>Back to the session</Button>
        </Pad>
      </Backdrop>
    </Screen>
  );
}

/* ══ 7 · SESSION DONE — THE WALK ══════════════════════════════════════════ */
function JourneyScreen({ go }) {
  return (
    <Screen>
      <Backdrop mood="day">
        <StatusBar time="18:51" />
        <Body>
          <Pad style={{ paddingTop: 16 }}>
            <Label size="sm">Session kept · 50 min</Label>
            <Headline size="l" style={{ margin: '10px 0 6px' }}>She is up and walking</Headline>
            <Note size="sm">Luna took the pack and set off down the country lane.</Note>
          </Pad>
          <div style={{ padding: '18px 0 0' }}>
            <Trail width={340} height={132} progress={0.66} landscape="lane" label="Country lane" />
          </div>
          <Pad style={{ paddingTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <Numeral size="md">2.4</Numeral>
              <Label size="sm">km today</Label>
            </div>
            <Rule gap={16} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <StatRow label="Total together" value="418 km" />
              <StatRow label="Now crossing" value="Country lane" />
              <StatRow label="Next place" value="Dune road · 6 km" last />
            </div>
          </Pad>
          <Pad style={{ padding: '22px 26px 20px' }}>
            <Button onClick={() => go('progress')}>See the route</Button>
          </Pad>
        </Body>
        <TabBar tabs={TABS} current="journey" onChange={v => go(v === 'today' ? 'today' : 'connect')} />
      </Backdrop>
    </Screen>
  );
}

/* ══ 8 · PROGRESS — WEEK / MONTH / YEAR ═══════════════════════════════════ */
const LEGS = [
  ['Mon', 0.9, 'lane'], ['Tue', 0.5, 'lane'], ['Wed', 1.0, 'desert'],
  ['Thu', 0.7, 'desert'], ['Fri', 0.85, 'peaks'], ['Sat', 0.2, 'peaks'], ['Sun', 0.35, 'lane'],
];

function ProgressScreen({ go }) {
  const [view, setView] = React.useState('week');
  return (
    <Screen>
      <Backdrop mood="day">
        <StatusBar time="21:04" />
        <Body>
          <Pad style={{ paddingTop: 16 }}>
            <SegmentedControl value={view} onChange={setView} options={[
              { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' },
              { value: 'year', label: 'Year' }]} />
          </Pad>
          <Pad style={{ paddingTop: 20 }}>
            <Headline size="m">14.8 km this week</Headline>
            <Note size="sm" style={{ marginTop: 8 }}>
              Three landscapes: the lane, the dune road, then the first mist in the hills.
            </Note>
          </Pad>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '18px 0 0' }}>
            {LEGS.map(([day, p, land]) => (
              <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 26px' }}>
                <span style={{
                  width: 30, fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.14em',
                  textTransform: 'uppercase', color: 'var(--dt-ink-2)',
                }}>{day}</span>
                <div style={{ flex: 1, borderRadius: 8, overflow: 'hidden' }}>
                  <Trail width={230} height={54} progress={p} landscape={land} pet={false} />
                </div>
                <span style={{
                  width: 44, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: 'var(--dt-ink)',
                }}>{(p * 3.6).toFixed(1)}</span>
              </div>
            ))}
          </div>
          <Pad style={{ padding: '22px 26px 20px' }}>
            <Button variant="quiet" onClick={() => go('globe')}>The year so far</Button>
          </Pad>
        </Body>
        <TabBar tabs={TABS} current="journey" onChange={v => go(v === 'today' ? 'today' : 'connect')} />
      </Backdrop>
    </Screen>
  );
}

/* ══ 9 · YEAR — THE GLOBE ═════════════════════════════════════════════════ */
function GlobeScreen({ go }) {
  return (
    <Screen mood="dusk">
      <Backdrop mood="dusk">
        <StatusBar time="23:12" />
        <Body>
          <Pad style={{ paddingTop: 16, textAlign: 'center' }}>
            <Label size="sm">2026 · together</Label>
            <Headline size="l" style={{ margin: '10px 0 4px' }}>We did it</Headline>
            <Note size="sm">365 days, one line, drawn only from time you kept.</Note>
          </Pad>
          <div style={{ padding: '10px 26px 0' }}>
            <Globe size={280} />
          </div>
          <Pad style={{ paddingTop: 8, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, justifyContent: 'center' }}>
              <Numeral size="lg">12 400</Numeral>
              <Label size="sm">km</Label>
            </div>
            <Note size="sm" style={{ marginTop: 8, color: 'var(--dt-ink-2)' }}>
              Lane → dune road → the mist → Paris. Luna slept through 431 hours of it.
            </Note>
          </Pad>
          <Pad style={{ padding: '20px 26px 20px' }}>
            <Button onClick={() => go('scrapbook')}>Open the travel diary</Button>
          </Pad>
        </Body>
      </Backdrop>
    </Screen>
  );
}

/* ══ 10 · SCRAPBOOK ═══════════════════════════════════════════════════════ */
const CARDS = [
  ['Dune road', 'It was warm all night. I walked under stars and did not bark once.', 'desert', false],
  ['Mist hills', 'Everything smelled of rain. I waited for you at the top.', 'peaks', false],
  ['Paris', 'A man gave me half a croissant. Do not tell anyone.', 'city', false],
  ['Coast road', 'Keep going and I will show you the sea.', 'lane', true],
];

function ScrapbookScreen({ go }) {
  return (
    <Screen>
      <Backdrop mood="day">
        <StatusBar time="23:20" />
        <Body>
          <Pad style={{ paddingTop: 16 }}>
            <Label size="sm">Travel diary · 14 postcards</Label>
            <Headline size="m" style={{ margin: '10px 0 6px' }}>Notes Luna sent back</Headline>
            <Note size="sm">One card per place you reached. The last one unlocks in 6 km.</Note>
          </Pad>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '18px 26px 24px',
          }}>
            {CARDS.map(([place, note, land, locked]) =>
              <Postcard key={place} place={place} note={note} landscape={land} locked={locked} />)}
          </div>
        </Body>
        <TabBar tabs={TABS} current="journey" onChange={v => go(v === 'today' ? 'today' : 'connect')} />
      </Backdrop>
    </Screen>
  );
}

/* ══ 11 · ASSISTANTS ══════════════════════════════════════════════════════ */
function AssistantsScreen({ go }) {
  return (
    <Screen>
      <Backdrop mood="day">
        <StatusBar time="9:12" />
        <Body>
          <Pad style={{ paddingTop: 16 }}>
            <Label size="sm">Connected over MCP</Label>
            <Headline size="m" style={{ margin: '10px 0 6px' }}>Two assistants, one rule</Headline>
            <Note size="sm">They may plan the day and read the route. They may never wake Luna.</Note>
          </Pad>
          <Pad style={{ paddingTop: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <StatRow label="Claude" value="plans · reads route" />
              <StatRow label="Calendar" value="reads only" last />
            </div>
            <Rule gap={18} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <BulletItem>May propose blocks and move free time.</BulletItem>
              <BulletItem>May read distance, places and postcards.</BulletItem>
              <BulletItem tone="caution">May never end a session or open a lock.</BulletItem>
            </div>
          </Pad>
          <Pad style={{ padding: '22px 26px 20px' }}>
            <Button variant="quiet" onClick={() => go('pro')}>Add an assistant</Button>
          </Pad>
        </Body>
        <TabBar tabs={TABS} current="connect" onChange={v => go(v === 'today' ? 'today' : 'journey')} />
      </Backdrop>
    </Screen>
  );
}

/* ══ 12 · PRO ═════════════════════════════════════════════════════════════ */
function ProScreen({ go }) {
  return (
    <Screen>
      <Backdrop mood="day">
        <StatusBar time="9:14" />
        <Body>
          <Pad style={{ paddingTop: 16 }}>
            <Label size="sm">FocusFlow Pro</Label>
            <Headline size="m" style={{ margin: '10px 0 6px' }}>Free walks one hour a day</Headline>
            <Note size="sm">Pro is the whole day, the globe, the diary and a second traveller.</Note>
          </Pad>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
            <Pet kind="cat" posture="walking" coat="var(--dt-coat-ash)" width={210} />
          </div>
          <Pad>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <BulletItem>Unlimited sessions and locks that hold.</BulletItem>
              <BulletItem>The globe, the year line and every postcard.</BulletItem>
              <BulletItem>A second pet, walking its own route.</BulletItem>
            </div>
          </Pad>
          <Pad style={{ padding: '24px 26px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
              <Numeral size="md">£4</Numeral><Label size="sm">/ month</Label>
            </div>
            <Button onClick={() => go('today')}>Start Pro</Button>
            <Button variant="tiny" onClick={() => go('today')}>Stay on free</Button>
          </Pad>
        </Body>
        <TabBar tabs={TABS} current="connect" onChange={v => go(v === 'today' ? 'today' : 'journey')} />
      </Backdrop>
    </Screen>
  );
}
