/* The kit page: screen list, captions and the phone stage. */
const SCREENS = [
  ['today', 'Today', TodayScreen, 'light'],
  ['plan', 'Proposal', ProposalScreen, 'light'],
  ['focus', 'Session', SessionScreen, 'dark'],
  ['grew', 'Day grew', DayGrewScreen, 'dark'],
  ['growth', 'Growth rule', GrowthRuleScreen, 'light'],
  ['blocked', 'Blocked', BlockedScreen, 'dark'],
  ['grove', 'Grove', GroveScreen, 'light'],
  ['share', 'Share', ShareScreen, 'light'],
  ['evening', 'Evening', EveningScreen, 'dark'],
  ['connect', 'Assistants', AssistantsScreen, 'light'],
  ['pro', 'Pro', ProScreen, 'light'],
];

const CAPS = {
  today: ['Today.', " The task is the headline; today's tree sits beside it at a glance size."],
  plan: ['Proposal.', ' Written by the assistant over MCP, held until you approve.'],
  focus: ['Session.', ' No tree here — growing it is the reward, never the pressure.'],
  grew: ['Day grew.', ' Stem first, then leaves on Fibonacci-spaced delays, so growth decelerates as it fills out.'],
  growth: ['Growth rule.', ' 1·1·2·3·5·8 blocks. Each stage costs the two before it.'],
  blocked: ['Blocked.', ' When the app reopens is the biggest thing on screen. No mention of the tree.'],
  grove: ['Grove.', ' Week is a row you can read; month is a stand with the newest week in front; year is twelve stands.'],
  share: ['Share.', ' Receding bands of forest, one honest line of totals, no task names.'],
  evening: ['Evening.', ' The day closes by being planted.'],
  connect: ['Assistants.', ' They may read the grove. They may never open a lock.'],
  pro: ['Pro.', ' Free plants one tree a day. Pro is the whole day, the month, the year and the friends.'],
};

function App() {
  const [id, setId] = React.useState('today');
  const [dark, setDark] = React.useState(false);
  const entry = SCREENS.find(s => s[0] === id) || SCREENS[0];
  const ScreenView = entry[2];
  const theme = dark ? 'dark' : entry[3];
  const go = next => setId(SCREENS.some(s => s[0] === next) ? next : 'today');

  React.useEffect(() => {
    document.documentElement.dataset.page = dark ? 'dark' : 'light';
    document.getElementById('theme').textContent = dark ? '◐ Light' : '◑ Dark';
  }, [dark]);
  React.useEffect(() => {
    const t = document.getElementById('theme');
    const h = () => setDark(d => !d);
    t.addEventListener('click', h);
    return () => t.removeEventListener('click', h);
  }, []);

  return (
    <React.Fragment>
      <nav className="chips" role="tablist" aria-label="Screens">
        {SCREENS.map(([v, label]) =>
          <Chip key={v} selected={v === id} onClick={() => setId(v)}>{label}</Chip>)}
      </nav>
      <div className="stage">
        <PhoneFrame theme={theme}>
          <ScreenView go={go} />
        </PhoneFrame>
        <p className="cap"><b>{CAPS[id][0]}</b>{CAPS[id][1]}</p>
      </div>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
