/* The grove, sharing, the assistant permissions screen and Pro. */

function GroveScreen({ go }) {
  const [view, setView] = React.useState('week');
  return (
    <Screen keyId="grove">
      <StatusBar time="21:04" />
      <Body>
        <Pad style={{ paddingTop: 24 }}>
          <SegmentedControl value={view} onChange={setView} options={[
            { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }, { value: 'year', label: 'Year' }]} />

          {view === 'week' && (
            <div>
              <Label style={{ marginTop: 20 }}>7–13 September</Label>
              <Headline size="m" style={{ marginTop: 10 }}>17 of 20 blocks.</Headline>
              <Grove view="week" style={{ marginTop: 16 }} />
              <Note style={{ marginTop: 14 }}>14h 10m protected · 8 things finished · Sunday planted as rest.</Note>
              <Rule />
              <Label>What the week is telling you</Label>
              <Headline size="s" style={{ marginTop: 10 }}>
                Thursday and Friday are your tall days.<br />Saturday keeps coming up pale.
              </Headline>
              <Button variant="quiet" style={{ marginTop: 14 }}>Move Saturday's work to Friday</Button>
            </div>
          )}

          {view === 'month' && (
            <div>
              <Label style={{ marginTop: 20 }}>September</Label>
              <Headline size="m" style={{ marginTop: 10 }}>A stand of 30 days.</Headline>
              <Grove view="month" style={{ marginTop: 16 }} />
              <Note style={{ marginTop: 14 }}>Newest week in front. 22 days planted, 4 rest days, 4 still to come.</Note>
              <Rule />
              <StatRow label="Green days" value="16 of 22" />
              <StatRow label="Protected" value="61h 20m" last />
              <Button variant="quiet" style={{ marginTop: 18 }} onClick={() => go('share')}>Share September</Button>
            </div>
          )}

          {view === 'year' && (
            <div>
              <Label style={{ marginTop: 20 }}>2026</Label>
              <Headline size="m" style={{ marginTop: 10 }}>208 days planted.</Headline>
              <Grove view="year" style={{ marginTop: 16 }} />
              <Note style={{ marginTop: 14 }}>
                One stand per month. Pale days stay in — a forest you edited would not be worth showing.
              </Note>
              <Rule />
              <StatRow label="Longest green run" value="19 days" />
              <StatRow label="Rest planted" value="31 days" last />
              <Button variant="quiet" style={{ marginTop: 18 }} onClick={() => go('share')}>Share 2026</Button>
            </div>
          )}
          <div style={{ height: 26 }} />
        </Pad>
      </Body>
      <TabBar tabs={TABS} current="grove" onChange={go} />
    </Screen>
  );
}

function ShareScreen({ go }) {
  const [fmt, setFmt] = React.useState('post');
  return (
    <Screen keyId="share">
      <StatusBar time="21:08" />
      <Body>
        <Pad style={{ paddingTop: 24 }}>
          <Label>Share</Label>
          <div style={{
            marginTop: 14, borderRadius: 'var(--radius-card)', overflow: 'hidden',
            background: 'var(--sky)', border: '1px solid var(--hairline)',
          }}>
            <ShareArt format={fmt} title="2026" subtitle="208 days planted" />
          </div>
          <Note size="sm" style={{ marginTop: 12 }}>
            Everything is drawn into one image — headline, totals and wordmark included.
          </Note>
          <SegmentedControl style={{ marginTop: 16 }} value={fmt} onChange={setFmt} options={[
            { value: 'post', label: 'Post 4:5' }, { value: 'story', label: 'Story 9:16' }, { value: 'wide', label: 'Wide' }]} />
          <Button style={{ marginTop: 14 }}>Save image</Button>
          <Button variant="tiny">Copy link to a read-only grove</Button>
          <Note size="sm" style={{ fontSize: 11.5, marginTop: 2 }}>
            Trees, days and totals only. Task names, app names and times never leave the phone.
          </Note>
          <div style={{ height: 24 }} />
        </Pad>
      </Body>
      <TabBar tabs={TABS} current="grove" onChange={go} />
    </Screen>
  );
}

function AssistantsScreen({ go }) {
  return (
    <Screen keyId="connect">
      <StatusBar time="9:41" />
      <Body>
        <Pad style={{ paddingTop: 28 }}>
          <Label>Assistants</Label>
          <Headline size="m" style={{ marginTop: 12 }}>They plan the hour.<br />Only you open it.</Headline>
          <Rule />
          <StatRow label="ChatGPT" value="connected" />
          <StatRow label="Claude" value="connected" />
          <StatRow label={<span style={{ color: 'var(--ink-3)' }}>Add another</span>} value="MCP" last />
          <Rule />
          <Label style={{ marginBottom: 8 }}>They can</Label>
          <BulletItem>Propose plans, for you to approve here</BulletItem>
          <BulletItem>Read your schedule, your grove and what you finished</BulletItem>
          <BulletItem>Make a block stricter</BulletItem>
          <Label style={{ margin: '20px 0 8px' }}>They can never</Label>
          <BulletItem tone="caution">End or shorten a running block</BulletItem>
          <BulletItem tone="caution">Take an app off your allowlist</BulletItem>
          <BulletItem tone="caution">Read your messages</BulletItem>
          <Note style={{ marginTop: 20 }}>No prompt gets you out of a lock. That is the lock.</Note>
          <div style={{ height: 18 }} />
        </Pad>
      </Body>
      <TabBar tabs={TABS} current="connect" onChange={go} />
    </Screen>
  );
}

function ProScreen({ go }) {
  return (
    <Screen keyId="pro">
      <StatusBar time="9:41" />
      <Body>
        <Pad style={{ paddingTop: 28 }}>
          <Label>FocusFlow Pro</Label>
          <Headline size="l" style={{ marginTop: 12 }}>Make the lock honest.</Headline>
          <Note style={{ marginTop: 12 }}>
            Free protects one block a day and plants one tree. You have kept six this week.
          </Note>
          <Rule />
          <StatRow label="Locks you cannot talk your way out of" value="Pro" />
          <StatRow label="Every block of the day, not one" value="Pro" />
          <StatRow label="Month, year and shareable forests" value="Pro" />
          <StatRow label="Private groves with friends" value="Pro" />
          <StatRow label="Plans from your assistant" value="Free" last />
          <Rule />
          <div style={{ textAlign: 'center' }}>
            <Headline size="m" as="div">$49.99{' '}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)' }}>/ year</span>
            </Headline>
            <Label style={{ marginTop: 10 }}>$24.99 for students</Label>
          </div>
          <Button style={{ marginTop: 22 }}>Start 7 days free</Button>
          <Button variant="tiny" onClick={() => go('today')}>Stay on Free</Button>
          <div style={{ height: 12 }} />
        </Pad>
      </Body>
      <TabBar tabs={TABS} current="connect" onChange={go} />
    </Screen>
  );
}

Object.assign(window, { GroveScreen, ShareScreen, AssistantsScreen, ProScreen });
