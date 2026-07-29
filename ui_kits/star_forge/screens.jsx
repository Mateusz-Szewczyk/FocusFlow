/* Star Forge — the screens.
   Product logic carries over unchanged: the assistant writes the day over MCP,
   you approve it, a session protects the time, progress accumulates. What you
   earn is a star, and a year of stars is a galaxy. */

const { Button, Chip, SegmentedControl, Rule, Headline, Label, Note, Numeral,
        StatRow, BulletItem, Timeline, StatusBar, TabBar, PhoneFrame } = FF;

const TABS = [{ value: 'today', label: 'Today' }, { value: 'sky', label: 'Sky' },
              { value: 'connect', label: 'You' }];

/* twenty-four nights: size = tasks finished, light = plan kept, colour = project,
   artifact = the rare form a day earned. */
const PIDS = ['thesis', 'finance', 'rewrite', 'reading', 'admin'];
const DAYS = Array.from({ length: 24 }, (_, i) => {
  const r = R(i * 137 + 21);
  const mass = 0.15 + r() * 0.85, clarity = 0.28 + r() * 0.72, q = r();
  const rest = q > 0.82 && q < 0.9;
  return {
    label: `Day ${i + 1}`,
    mass: rest ? 0 : mass, clarity: rest ? null : clarity, rest,
    project: PIDS[Math.floor(r() * PIDS.length)],
    project2: PIDS[Math.floor(r() * PIDS.length)],
    artifact: rest ? 'wisp' : clarity > 0.93 ? 'ring' : q > 0.9 ? 'binary'
      : q < 0.09 ? 'comet' : null,
  };
});
const WEEK_KEPT = [true, true, true, false, true, true, null];

const ARTIFACTS = {
  plain: 'star', faint: 'faint · a light day', ring: 'ringed · every block kept',
  binary: 'binary · two projects', comet: 'comet · came back', wisp: 'wisp · rest day',
};

const ORION = {
  name: 'Orion',
  edges: [[3, 7], [7, 11], [11, 14], [14, 18], [3, 9], [9, 14]],
  need: 5, have: 3,
};

function Screen({ children, style }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      background: 'var(--sf-night)', color: 'var(--sf-ink)', fontFamily: 'var(--font-body)',
      overflow: 'hidden', ...style,
    }}>
      <div className="sf-veil" aria-hidden="true" />
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {children}
      </div>
    </div>
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

const Pad = ({ children, style }) => <div style={{ padding: '0 26px', ...style }}>{children}</div>;

/* ══ 1 · LOCK SCREEN / LIVE ACTIVITY ══════════════════════════════════════ */
function LockScreen({ go }) {
  return (
    <Screen>
      <StatusBar time="18:12" />
      <Body>
        <div style={{ textAlign: 'center', padding: '18px 0 4px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.22em',
            textTransform: 'uppercase', color: 'var(--sf-ink-2)',
          }}>Tuesday 14 July</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 68, lineHeight: 1.05,
            letterSpacing: '-.02em', color: 'var(--sf-ink)', marginTop: 4,
          }}>18:12</div>
        </div>

        {/* the live activity card — the only lit object on the lock screen */}
        <div style={{ padding: '20px 18px 0' }}>
          <div style={{
            background: 'var(--sf-card)', border: '1px solid var(--sf-line)', borderRadius: 22,
            padding: '16px 18px 18px', backdropFilter: 'blur(12px)',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Label size="xs" style={{ color: 'var(--sf-ink-2)' }}>Now · forging</Label>
              <Label size="xs" style={{ color: 'var(--sf-ink-3)' }}>Star Forge</Label>
            </div>
            <Headline size="s" style={{ margin: 0, color: 'var(--sf-ink)' }}>
              Writing the finance report
            </Headline>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 92, flexShrink: 0 }}>
                <Star mass={0.42} clarity={0.9} project="finance" size={92} pulse />
              </div>
              <div style={{ minWidth: 0 }}>
                <Numeral size="md" style={{ color: 'var(--sf-ink)' }}>12:04</Numeral>
                <div style={{
                  marginTop: 6, height: 2, background: 'var(--sf-line)', borderRadius: 2, overflow: 'hidden',
                }}>
                  <div className="sf-fill" style={{ height: '100%', background: 'var(--sf-glow)' }} />
                </div>
              </div>
            </div>
            <div style={{
              borderTop: '1px solid var(--sf-line)', paddingTop: 12,
              fontFamily: 'var(--font-display)', fontSize: 14.5, lineHeight: 1.55,
              color: 'var(--sf-ink-2)',
            }}>
              12 minutes left for this star to burn at full light. Put the phone down.
            </div>
          </div>
        </div>

        <Pad style={{ paddingTop: 22, textAlign: 'center' }}>
          <Note size="sm" style={{ color: 'var(--sf-ink-3)' }}>
            Notifications stay quiet until 18:50. Calls, Maps, bank and 2FA still ring.
          </Note>
        </Pad>
      </Body>
      <Pad style={{ paddingBottom: 20 }}>
        <Button variant="tiny" onClick={() => go('focus')} style={{ color: 'var(--sf-ink-3)' }}>
          Open Star Forge
        </Button>
      </Pad>
    </Screen>
  );
}

/* ══ 2 · TODAY ════════════════════════════════════════════════════════════ */
function TodayScreen({ go }) {
  const [done, setDone] = React.useState([true, true, false, false]);
  const TASKS = ['Rewrite lecture notes', 'Problem set 6', 'Finance report', 'Read chapter 3'];
  const finished = done.filter(Boolean).length;
  return (
    <Screen>
      <StatusBar time="9:41" />
      <Body>
        <Pad style={{ paddingTop: 14 }}>
          <Label size="sm" style={{ color: 'var(--sf-ink-2)' }}>Next · 18:00</Label>
          <Headline size="l" style={{ margin: '10px 0 6px', color: 'var(--sf-ink)' }}>
            Today’s star is forming
          </Headline>
          <Note size="sm" style={{ color: 'var(--sf-ink-2)' }}>
            {finished} of 4 tasks finished · size follows the list, light follows the timer,
            colour is the project.
          </Note>
          <WeekMeter kept={WEEK_KEPT} project="finance" style={{ marginTop: 18 }} />
        </Pad>

        <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 0' }}>
          <div style={{ width: 172 }}>
            <Star mass={0.12 + finished * 0.2} clarity={0.86} project="finance"
              artifact={finished === 4 ? 'ring' : null} size={172} pulse />
          </div>
        </div>

        <Pad style={{ paddingTop: 6 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {TASKS.map((t, i) => (
              <button key={t} onClick={() => setDone(d => d.map((v, k) => k === i ? !v : v))} style={{
                display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 0,
                borderBottom: '1px solid var(--sf-line)', padding: '13px 0', cursor: 'pointer',
                textAlign: 'left', color: 'inherit',
              }}>
                <span style={{
                  width: 16, height: 16, borderRadius: 999, flexShrink: 0,
                  border: `1px solid ${done[i] ? 'transparent' : 'var(--sf-line-2)'}`,
                  background: done[i] ? 'var(--sf-glow)' : 'transparent',
                  boxShadow: done[i] ? '0 0 10px var(--sf-glow)' : 'none',
                  transition: 'background .3s, box-shadow .3s',
                }} />
                <span style={{
                  fontSize: 14.5, color: done[i] ? 'var(--sf-ink-2)' : 'var(--sf-ink)',
                  textDecoration: done[i] ? 'line-through' : 'none',
                }}>{t}</span>
              </button>
            ))}
          </div>
          <Button variant="inline" onClick={() => go('plan')} style={{ marginTop: 14, color: 'var(--sf-ink-2)' }}>
            Claude proposed 26 blocks · review
          </Button>
        </Pad>

        <Pad style={{ padding: '22px 26px 20px' }}>
          <Button onClick={() => go('focus')}>Start forging · 50 min</Button>
        </Pad>
      </Body>
      <TabBar tabs={TABS} current="today" onChange={v => go(v === 'sky' ? 'sky' : 'connect')} />
    </Screen>
  );
}

/* ══ 3 · PROPOSAL (MCP) ═══════════════════════════════════════════════════ */
function ProposalScreen({ go }) {
  return (
    <Screen>
      <StatusBar time="9:42" />
      <Body>
        <Pad style={{ paddingTop: 14 }}>
          <Label size="sm" style={{ color: 'var(--sf-ink-2)' }}>Written by Claude over MCP</Label>
          <Headline size="m" style={{ margin: '10px 0 8px', color: 'var(--sf-ink)' }}>
            26 blocks, held for approval
          </Headline>
          <Note size="sm" style={{ color: 'var(--sf-ink-2)' }}>
            Nothing reaches your calendar and no star is lit until you say yes.
          </Note>
          <Timeline items={[
            { time: '08:30', name: 'Rewrite lecture notes', state: 'done' },
            { time: '10:00', name: 'Problem set 6', state: 'done' },
            { time: '18:00', name: 'Finance report', state: 'now' },
            { time: '19:00', name: 'Free time', state: 'todo' },
          ]} />
        </Pad>
        <Pad style={{ paddingTop: 16 }}>
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
    </Screen>
  );
}

/* ══ 4 · FOCUS — THE FORGE ════════════════════════════════════════════════ */
function ForgeScreen({ go }) {
  return (
    <Screen>
      <StatusBar time="18:12" />
      <Body center style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Forge size={330} mass={0.52} clarity={0.94} project="finance" />
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 26, pointerEvents: 'none',
          }}>
            <Numeral size="lg" style={{ color: 'var(--sf-ink)', textShadow: '0 0 24px rgba(10,14,34,.8)' }}>
              37:48
            </Numeral>
          </div>
        </div>
        <Pad style={{ marginTop: 10 }}>
          <Label size="xs" style={{ color: 'var(--sf-ink-3)' }}>Now · forging</Label>
          <Headline size="s" style={{ margin: '10px 0 0', color: 'var(--sf-ink)' }}>
            Writing the finance report
          </Headline>
          <Note size="sm" style={{ marginTop: 10, color: 'var(--sf-ink-2)' }}>
            Dust keeps drifting in while you stay. Nothing to watch, nothing to tap.
          </Note>
        </Pad>
      </Body>
      <Pad style={{ paddingBottom: 18 }}>
        <Button variant="tiny" onClick={() => go('drift')} style={{ color: 'var(--sf-ink-3)' }}>
          Finish early
        </Button>
      </Pad>
    </Screen>
  );
}

/* ══ 5 · DISTRACTION ══════════════════════════════════════════════════════ */
function DriftScreen({ go }) {
  return (
    <Screen>
      <StatusBar time="18:14" />
      <Body center style={{ textAlign: 'center' }}>
        <div style={{ opacity: 0.62, transition: 'opacity .8s' }}>
          <Forge size={250} mass={0.5} clarity={0.42} project="finance" stalled />
        </div>
        <Pad style={{ marginTop: 18 }}>
          <Headline size="m" style={{ color: 'var(--sf-ink)' }}>Everything all right?</Headline>
          <Note size="md" style={{ marginTop: 12, color: 'var(--sf-ink-2)' }}>
            The dust stopped drifting. Your star needs a little more quiet to burn
            clear — come back to the rhythm and it picks up where it stopped.
          </Note>
          <Numeral size="sm" tone="secondary" style={{ marginTop: 18, color: 'var(--sf-ink-2)' }}>
            36 MIN LEFT · CLARITY 62%
          </Numeral>
        </Pad>
      </Body>
      <Pad style={{ paddingBottom: 20 }}>
        <Button onClick={() => go('focus')}>Back to the rhythm</Button>
        <Button variant="tiny" onClick={() => go('sky')} style={{ color: 'var(--sf-ink-3)' }}>
          End here · keep what it made
        </Button>
      </Pad>
    </Screen>
  );
}

/* ══ 6 · LOCKED APP ═══════════════════════════════════════════════════════ */
function BlockedScreen({ go }) {
  return (
    <Screen>
      <StatusBar time="18:28" />
      <Body center style={{ textAlign: 'center' }}>
        <Pad>
          <Numeral size="lg" style={{ color: 'var(--sf-ink)' }}>22:04</Numeral>
          <Note size="sm" style={{ marginTop: 8, color: 'var(--sf-ink-2)' }}>
            before this app opens again
          </Note>
          <div style={{ padding: '22px 30px 0' }}>
            <Star mass={0.5} clarity={0.88} project="finance" size={150} pulse />
          </div>
          <Note size="sm" style={{ marginTop: 14, color: 'var(--sf-ink-2)' }}>
            Still burning. Calls, Maps, bank and 2FA stay open.
          </Note>
        </Pad>
      </Body>
      <Pad style={{ paddingBottom: 18 }}>
        <Button variant="tiny" onClick={() => go('focus')} style={{ color: 'var(--sf-ink-3)' }}>
          Back to the session
        </Button>
      </Pad>
    </Screen>
  );
}

/* ══ 7 · SKY — THE DASHBOARD ══════════════════════════════════════════════ */
function SkyScreen({ go }) {
  const [view, setView] = React.useState('month');
  const [lines, setLines] = React.useState(false);
  const [picked, setPicked] = React.useState(null);
  const day = DAYS.find(d => d.label === picked);
  return (
    <Screen>
      <StatusBar time="21:04" />
      <Body>
        <Pad style={{ paddingTop: 14 }}>
          <SegmentedControl value={view} onChange={setView} options={[
            { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' }]} />
        </Pad>
        <Pad style={{ paddingTop: 18 }}>
          <Headline size="m" style={{ color: 'var(--sf-ink)' }}>24 stars this month</Headline>
          <Note size="sm" style={{ marginTop: 8, color: 'var(--sf-ink-2)' }}>
            Size is what you finished, light is the plan kept, colour is the project.
            Nothing leaves the sky — a broken night only goes misty.
          </Note>
        </Pad>
        <div style={{ padding: '6px 8px 0' }}>
          <Sky days={view === 'week' ? DAYS.slice(-7) : DAYS} width={320} height={280}
            constellation={lines ? ORION : null} onPick={setPicked} selected={picked} />
        </div>
        <Pad style={{ paddingBottom: 14 }}>
          <Legend />
        </Pad>
        <Pad style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          <Chip selected={lines} onClick={() => setLines(l => !l)}>Constellations</Chip>
          <Chip selected={!!picked} onClick={() => setPicked(null)}>
            {picked ? picked : 'Tap a star'}
          </Chip>
        </Pad>

        {lines && (
          <Pad style={{ paddingTop: 18 }}>
            <div style={{
              border: '1px solid var(--sf-line)', borderRadius: 16, padding: '14px 16px',
              background: 'var(--sf-card)', display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Headline size="s" style={{ margin: 0, color: 'var(--sf-ink)' }}>Orion</Headline>
                <Label size="xs" style={{ color: 'var(--sf-ink-2)' }}>3 of 5 stars</Label>
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {[0, 1, 2, 3, 4].map(i => (
                  <span key={i} style={{
                    flex: 1, height: 2, borderRadius: 2,
                    background: i < ORION.have ? 'var(--sf-glow)' : 'var(--sf-line-2)',
                    boxShadow: i < ORION.have ? '0 0 8px var(--sf-glow)' : 'none',
                  }} />
                ))}
              </div>
              <Note size="sm" style={{ color: 'var(--sf-ink-2)' }}>
                Two more days above 80% clarity and the belt closes.
              </Note>
            </div>
          </Pad>
        )}

        {day && (
          <Pad style={{ paddingTop: 16 }}>
            <Rule gap={0} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 12 }}>
              <StatRow label={day.label}
                value={day.rest ? 'rest, planted' : `${Math.max(1, Math.round(day.mass * 9))} tasks finished`} />
              {!day.rest && <StatRow label="Clarity" value={`${Math.round(day.clarity * 100)}%`} />}
              <StatRow label="Project" value={day.rest ? '—' : (BY_ID[day.project] || {}).name} />
              <StatRow label="Form" value={ARTIFACTS[day.artifact || (day.mass < 0.24 ? 'faint' : 'plain')]} last />
            </div>
          </Pad>
        )}

        <Pad style={{ padding: '22px 26px 20px' }}>
          <Button variant="quiet" onClick={() => go('cosmos')}>The year so far</Button>
          <Button variant="tiny" onClick={() => go('nova')} style={{ color: 'var(--sf-ink-3)' }}>
            Last nova · week 28
          </Button>
        </Pad>
      </Body>
      <TabBar tabs={TABS} current="sky" onChange={v => go(v === 'today' ? 'today' : 'connect')} />
    </Screen>
  );
}

/* ══ 8 · YEAR — THE COSMOS ════════════════════════════════════════════════ */
function CosmosScreen({ go }) {
  return (
    <Screen>
      <StatusBar time="23:12" />
      <Body>
        <Pad style={{ paddingTop: 16, textAlign: 'center' }}>
          <Label size="sm" style={{ color: 'var(--sf-ink-2)' }}>2026 · 341 stars</Label>
          <Headline size="l" style={{ margin: '10px 0 4px', color: 'var(--sf-ink)' }}>
            You made this
          </Headline>
          <Note size="sm" style={{ color: 'var(--sf-ink-2)' }}>
            Every point of light is a day you finished something.
          </Note>
        </Pad>
        <div style={{ padding: '8px 6px 0' }}>
          <Cosmos size={320} count={340} />
        </div>
        <Pad style={{ paddingTop: 6, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 26 }}>
            {[['341', 'stars'], ['9', 'constellations'], ['431 h', 'protected']].map(([v, l]) => (
              <div key={l}>
                <Numeral size="sm" style={{ color: 'var(--sf-ink)' }}>{v}</Numeral>
                <Label size="xs" style={{ marginTop: 4, color: 'var(--sf-ink-3)' }}>{l}</Label>
              </div>
            ))}
          </div>
        </Pad>
        <Pad style={{ padding: '22px 26px 20px' }}>
          <Button onClick={() => go('atlas')}>Open the astro atlas</Button>
        </Pad>
      </Body>
    </Screen>
  );
}

/* ══ 9 · ATLAS ════════════════════════════════════════════════════════════ */
const ATLAS = [
  ['Orion', 'March', 'Thesis chapter 2', 5, 0.93],
  ['The Plough', 'June', 'Launch week', 7, 0.81],
  ['Lyra', 'September', 'Finance reports', 4, 0.88],
  ['Cassiopeia', 'November', 'Rewrite of the app', 5, 0.72],
];

function AtlasScreen({ go }) {
  const [open, setOpen] = React.useState('Orion');
  return (
    <Screen>
      <StatusBar time="23:20" />
      <Body>
        <Pad style={{ paddingTop: 16 }}>
          <Label size="sm" style={{ color: 'var(--sf-ink-2)' }}>Astro atlas · 9 constellations</Label>
          <Headline size="m" style={{ margin: '10px 0 6px', color: 'var(--sf-ink)' }}>
            What each one was made of
          </Headline>
          <Note size="sm" style={{ color: 'var(--sf-ink-2)' }}>
            Tap a constellation to see the work it came from.
          </Note>
        </Pad>
        <Pad style={{ paddingTop: 18 }}>
          <Label size="xs" style={{ color: 'var(--sf-ink-3)', marginBottom: 12 }}>Novae · 3 perfect weeks</Label>
          <div style={{ display: 'flex', gap: 12 }}>
            {[['wk 12', 'rewrite'], ['wk 21', 'finance'], ['wk 28', 'thesis']].map(([wk, pr]) => (
              <div key={wk} style={{
                flex: 1, border: '1px solid var(--sf-line)', borderRadius: 14,
                background: 'var(--sf-card)', padding: '10px 8px 8px', textAlign: 'center',
              }}>
                <Nova size={74} project={pr} reveal={false} />
                <div style={{
                  marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 8.5,
                  letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--sf-ink-2)',
                }}>{wk} · {pr}</div>
              </div>
            ))}
          </div>
        </Pad>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '18px 26px 24px' }}>
          {ATLAS.map(([name, month, project, stars, clarity]) => {
            const isOpen = open === name;
            return (
              <button key={name} onClick={() => setOpen(isOpen ? null : name)} style={{
                textAlign: 'left', cursor: 'pointer', background: 'var(--sf-card)',
                border: `1px solid ${isOpen ? 'var(--sf-line-2)' : 'var(--sf-line)'}`,
                borderRadius: 16, padding: '14px 16px', color: 'inherit',
                display: 'flex', flexDirection: 'column', gap: isOpen ? 12 : 0,
                transition: 'border-color .3s, gap .3s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--sf-ink)' }}>{name}</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.16em',
                    textTransform: 'uppercase', color: 'var(--sf-ink-3)',
                  }}>{month}</span>
                </div>
                {isOpen && (
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ width: 74, flexShrink: 0 }}>
                      <Star mass={0.3 + stars * 0.09} clarity={clarity}
                        project={PIDS[name.length % PIDS.length]} size={74} />
                    </div>
                    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 14, color: 'var(--sf-ink)' }}>{project}</span>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.12em',
                        color: 'var(--sf-ink-2)',
                      }}>{stars} STARS · CLARITY {Math.round(clarity * 100)}%</span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Body>
      <TabBar tabs={TABS} current="sky" onChange={v => go(v === 'today' ? 'today' : 'connect')} />
    </Screen>
  );
}

/* ══ 10 · ASSISTANTS ══════════════════════════════════════════════════════ */
function AssistantsScreen({ go }) {
  return (
    <Screen>
      <StatusBar time="9:12" />
      <Body>
        <Pad style={{ paddingTop: 16 }}>
          <Label size="sm" style={{ color: 'var(--sf-ink-2)' }}>Connected over MCP</Label>
          <Headline size="m" style={{ margin: '10px 0 6px', color: 'var(--sf-ink)' }}>
            Two assistants, one rule
          </Headline>
          <Note size="sm" style={{ color: 'var(--sf-ink-2)' }}>
            They may plan the day and read the sky. They may never end a session.
          </Note>
        </Pad>
        <Pad style={{ paddingTop: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <StatRow label="Claude" value="plans · reads sky" />
            <StatRow label="Calendar" value="reads only" last />
          </div>
          <Rule gap={18} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <BulletItem>May propose blocks and move free time.</BulletItem>
            <BulletItem>May read stars, clarity and constellations.</BulletItem>
            <BulletItem tone="caution">May never unlock an app or dim a star.</BulletItem>
          </div>
        </Pad>
        <Pad style={{ padding: '22px 26px 20px' }}>
          <Button variant="quiet" onClick={() => go('pro')}>Add an assistant</Button>
        </Pad>
      </Body>
      <TabBar tabs={TABS} current="connect" onChange={v => go(v === 'today' ? 'today' : 'sky')} />
    </Screen>
  );
}

/* ══ 11 · PRO ═════════════════════════════════════════════════════════════ */
function ProScreen({ go }) {
  return (
    <Screen>
      <StatusBar time="9:14" />
      <Body>
        <Pad style={{ paddingTop: 16 }}>
          <Label size="sm" style={{ color: 'var(--sf-ink-2)' }}>Star Forge Pro</Label>
          <Headline size="m" style={{ margin: '10px 0 6px', color: 'var(--sf-ink)' }}>
            Free forges one star a day
          </Headline>
          <Note size="sm" style={{ color: 'var(--sf-ink-2)' }}>
            Pro is the whole sky: constellations, the year, the atlas and locks that hold.
          </Note>
        </Pad>
        <div style={{ padding: '4px 0 0' }}>
          <Cosmos size={280} count={200} zoom={false} />
        </div>
        <Pad>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <BulletItem>Unlimited sessions and locks that hold.</BulletItem>
            <BulletItem>Constellations, the year view and the atlas.</BulletItem>
            <BulletItem>Live Activity on the lock screen.</BulletItem>
          </div>
        </Pad>
        <Pad style={{ padding: '22px 26px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
            <Numeral size="md" style={{ color: 'var(--sf-ink)' }}>£4</Numeral>
            <Label size="sm" style={{ color: 'var(--sf-ink-2)' }}>/ month</Label>
          </div>
          <Button onClick={() => go('today')}>Start Pro</Button>
          <Button variant="tiny" onClick={() => go('today')} style={{ color: 'var(--sf-ink-3)' }}>
            Stay on free
          </Button>
        </Pad>
      </Body>
      <TabBar tabs={TABS} current="connect" onChange={v => go(v === 'today' ? 'today' : 'sky')} />
    </Screen>
  );
}

/* ══ 12 · NOVA — the perfect week ══════════════════════════════════════════
   Seven kept nights fuse into one object: named, dated, permanent, and the only
   thing in the app that arrives with a shockwave. */
function NovaScreen({ go }) {
  return (
    <Screen>
      <StatusBar time="23:58" />
      <Body center style={{ textAlign: 'center' }}>
        <div style={{ padding: '0 22px' }}>
          <Nova size={300} project="thesis" />
        </div>
        <Pad style={{ marginTop: 6 }}>
          <Label size="xs" style={{ color: 'var(--sf-ink-3)' }}>Seven of seven nights</Label>
          <Headline size="l" style={{ margin: '12px 0 8px', color: 'var(--sf-ink)' }}>
            A nova
          </Headline>
          <Note size="md" style={{ color: 'var(--sf-ink-2)' }}>
            You kept every block, seven nights running. The week collapsed into one
            star — it keeps its colour, its date and its name for good.
          </Note>
          <div style={{
            marginTop: 20, border: '1px solid var(--sf-line)', borderRadius: 16,
            background: 'var(--sf-card)', padding: '14px 16px',
            display: 'flex', flexDirection: 'column', gap: 2,
          }}>
            <StatRow label="Name" value="Nova Thesis · wk 28" />
            <StatRow label="Made of" value="7 nights · 31 tasks" />
            <StatRow label="Clarity" value="97% average" last />
          </div>
        </Pad>
      </Body>
      <Pad style={{ paddingBottom: 20 }}>
        <Button onClick={() => go('atlas')}>Put it in the atlas</Button>
        <Button variant="tiny" onClick={() => go('sky')} style={{ color: 'var(--sf-ink-3)' }}>
          Back to the sky
        </Button>
      </Pad>
    </Screen>
  );
}
