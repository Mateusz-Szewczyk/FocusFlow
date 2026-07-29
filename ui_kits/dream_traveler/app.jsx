/* The kit page: screen list, captions and the phone stage. */

const SCREENS = [
  ['onboard', 'Onboarding', OnboardingScreen],
  ['today', 'Today', TodayScreen],
  ['plan', 'Proposal', ProposalScreen],
  ['focus', 'Deep sleep', SleepScreen],
  ['stirred', 'Stirred', StirredScreen],
  ['blocked', 'Blocked app', BlockedScreen],
  ['journey', 'The walk', JourneyScreen],
  ['progress', 'Route', ProgressScreen],
  ['globe', 'The year', GlobeScreen],
  ['scrapbook', 'Diary', ScrapbookScreen],
  ['connect', 'Assistants', AssistantsScreen],
  ['pro', 'Pro', ProScreen],
];

const CAPS = {
  onboard: ['Onboarding.', ' Two watercolour tiles, then breed and coat. The pet you choose is drawn live in the tile, so the bond starts before the first session.'],
  today: ['Today.', ' The task is the headline; the pet naps beside it. Distance replaces points, and the assistant’s proposal sits one quiet line down.'],
  plan: ['Proposal.', ' Written by Claude over MCP and held until you approve. Unchanged from the grove build — only the reward changed.'],
  focus: ['Deep sleep.', ' The whole screen is the sleeping pet. Timer is set in the wash, not on top of it, and the only action is a tiny mono link.'],
  stirred: ['Stirred.', ' No wilting, no loss. She lifted her head, the time remaining is stated plainly, and the primary button is “Back to sleep”.'],
  blocked: ['Blocked app.', ' What matters is when the app opens again. The pet is asleep in the corner of the message, never used as a reprimand.'],
  journey: ['The walk.', ' The reward is ground covered: pack on, gold line drawn across the landscape, one honest number.'],
  progress: ['Route.', ' A week is seven legs you can read. The landscape changes as the total grows — lane, dune road, mist.'],
  globe: ['The year.', ' A pastel world with one glowing line. The moment is geographic, not statistical.'],
  scrapbook: ['Diary.', ' Postcards unlock by distance. The note is written in the pet’s voice; locked cards stay visible so there is something ahead.'],
  connect: ['Assistants.', ' They may plan and read the route. They may never wake the pet or open a lock.'],
  pro: ['Pro.', ' Free walks an hour a day. Pro is the globe, the diary and a second traveller.'],
};

function App() {
  const [id, setId] = React.useState('today');
  const entry = SCREENS.find(s => s[0] === id) || SCREENS[1];
  const ScreenView = entry[2];
  const go = next => setId(SCREENS.some(s => s[0] === next) ? next : 'today');
  return (
    <React.Fragment>
      <nav className="chips" role="tablist" aria-label="Screens">
        {SCREENS.map(([v, label]) =>
          <Chip key={v} selected={v === id} onClick={() => setId(v)}>{label}</Chip>)}
      </nav>
      <div className="stage">
        <div data-dt-kit="true">
          <PhoneFrame>
            <ScreenView go={go} />
          </PhoneFrame>
        </div>
        <p className="cap"><b>{CAPS[id][0]}</b>{CAPS[id][1]}</p>
      </div>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
