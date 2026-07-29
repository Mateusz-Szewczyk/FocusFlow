/* The night screens: a running session, the day it grew, the block screen,
   the growth rule and the evening. */

function SessionScreen({ go }) {
  return (
    <Screen keyId="focus" theme="dark">
      <StatusBar time="18:12" />
      <Body center style={{ textAlign: 'center' }}>
        <Pad>
          <Headline size="m">Review chapter 3</Headline>
          <BreathRing size={186} style={{ marginTop: 4 }} />
          <Numeral size="md" style={{ marginTop: -10 }}>37:48</Numeral>
          <Label style={{ marginTop: 12 }}>until 18:50</Label>
        </Pad>
      </Body>
      <Pad style={{ paddingBottom: 20 }}>
        <Button variant="quiet" onClick={() => go('grew')}>Finished early</Button>
        <Button variant="tiny" onClick={() => go('blocked')}>What's blocked right now</Button>
      </Pad>
    </Screen>
  );
}

function DayGrewScreen({ go }) {
  return (
    <Screen keyId="grew" theme="dark">
      <StatusBar time="18:50" />
      <Body center style={{ textAlign: 'center' }}>
        <Pad>
          <Label>Third block kept · 50 minutes</Label>
          <Tree stage={4} green={3} size={2.1} seed={12} width={200} height={168}
            style={{ margin: '14px auto 2px', maxWidth: 200 }} />
          <Headline size="m">Today branched.</Headline>
          <Note style={{ marginTop: 10 }}>Two more blocks and it branches again.</Note>
          <Rule gap={22} style={{ marginBottom: 4 }} />
          <StatRow label="Height" value="2h 30m kept" />
          <StatRow label="Leaves" value="3 things finished" />
          <StatRow label="Colour" value="all of your plan" last />
        </Pad>
      </Body>
      <Pad style={{ paddingBottom: 20 }}>
        <Button onClick={() => go('today')}>Next block at 19:00</Button>
        <Button variant="tiny" onClick={() => go('grove')}>See the grove</Button>
      </Pad>
    </Screen>
  );
}

function BlockedScreen({ go }) {
  return (
    <Screen keyId="blocked" theme="dark">
      <StatusBar time="18:23" />
      <Body center>
        <Pad style={{ textAlign: 'center' }}>
          <Label>Instagram opens at</Label>
          <Numeral size="lg" style={{ marginTop: 14 }}>18:50</Numeral>
          <Note style={{ marginTop: 10 }}>in 26 minutes, on its own</Note>
          <Rule />
          <Label>Until then</Label>
          <Headline size="m" style={{ marginTop: 10 }}>Review chapter 3</Headline>
          <Note style={{ marginTop: 22, fontStyle: 'italic', lineHeight: 1.7 }}>
            “Exam is in nine days.<br />Future me will be glad.”
          </Note>
          <Label style={{ marginTop: 10 }}>your note, 17:58</Label>
        </Pad>
      </Body>
      <Pad style={{ paddingBottom: 20 }}>
        <Button onClick={() => go('focus')}>Back</Button>
        <Button variant="quiet" style={{ marginTop: 9 }}>Breathe for 30 seconds</Button>
        <Button variant="tiny">Unlock early · 15 min wait</Button>
      </Pad>
    </Screen>
  );
}

function GrowthRuleScreen({ go }) {
  const stages = [[-1, '—'], [0, '1'], [1, '1'], [2, '2'], [3, '3'], [4, '5'], [5, '8']];
  return (
    <Screen keyId="growth">
      <StatusBar time="9:41" />
      <Body>
        <Pad style={{ paddingTop: 28 }}>
          <Label>How a day grows</Label>
          <Headline size="m" style={{ marginTop: 12 }}>One, one, two,<br />three, five, eight.</Headline>
          <Note style={{ marginTop: 12 }}>
            Each stage costs the two before it. The first block changes the tree the most —
            and no day can be farmed past the eighth block.
          </Note>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, marginTop: 22 }}>
            {stages.map(([s, l], i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <Tree stage={s} green={s < 2 ? 1 : s < 4 ? 2 : 3} size={.72} seed={s * 13 + 3}
                  width={44} height={92} />
                <Label size="xs" style={{ marginTop: 2 }}>{l}</Label>
              </div>
            ))}
          </div>
          <Rule />
          <StatRow label="Height" value="blocks you kept" />
          <StatRow label="Leaves" value="things you finished" />
          <StatRow label="Colour" value="kept ÷ planned" last />
          <Note style={{ marginTop: 16 }}>
            Two kept out of two is fully green, however small. Eight planned and three kept
            grows tall and pale. The colour is for honesty, the height is for volume.
          </Note>
          <div style={{ height: 24 }} />
        </Pad>
      </Body>
      <TabBar tabs={TABS} current="grove" onChange={go} />
    </Screen>
  );
}

function EveningScreen({ go }) {
  const leaf = (w) => (
    <svg width={w} height={w} viewBox="0 0 12 12">
      <path d="M6 1 C1 4 1 9 6 11 C11 9 11 4 6 1" fill="none" stroke="var(--leaf)" strokeWidth="1" />
    </svg>
  );
  return (
    <Screen keyId="evening" theme="dark">
      <div style={{ filter: 'saturate(.2)', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <StatusBar time="21:00" />
        <Body center style={{ position: 'relative' }}>
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            <span className="ff-fall" style={{ position: 'absolute', top: '-6%', left: '24%', opacity: 0 }}>{leaf(9)}</span>
            <span className="ff-fall" style={{ position: 'absolute', top: '-6%', left: '62%', opacity: 0, animationDuration: '29s', animationDelay: '-11s' }}>{leaf(8)}</span>
            <span className="ff-fall" style={{ position: 'absolute', top: '-6%', left: '38%', opacity: 0, animationDuration: '34s', animationDelay: '-23s' }}>{leaf(7)}</span>
          </div>
          <Pad style={{ textAlign: 'center', position: 'relative' }}>
            <Tree stage={5} green={3} size={1.9} seed={21} width={190} height={156} animate={false}
              style={{ margin: '0 auto 20px', maxWidth: 190 }} />
            <Headline size="l">The day is planted.</Headline>
            <Note style={{ marginTop: 18 }}>
              Colour comes back at 07:00.<br />Tomorrow starts with lecture notes at 08:30.
            </Note>
          </Pad>
        </Body>
        <Pad style={{ paddingBottom: 20 }}>
          <Button variant="tiny" onClick={() => go('today')}>Change tomorrow's first block</Button>
        </Pad>
      </div>
    </Screen>
  );
}

Object.assign(window, { SessionScreen, DayGrewScreen, BlockedScreen, GrowthRuleScreen, EveningScreen });
