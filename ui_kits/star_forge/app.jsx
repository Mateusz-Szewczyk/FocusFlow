/* The kit page: screen list, captions and the phone stage. */

const SCREENS = [
  ['lock', 'Lock screen', LockScreen],
  ['today', 'Today', TodayScreen],
  ['plan', 'Proposal', ProposalScreen],
  ['focus', 'The forge', ForgeScreen],
  ['drift', 'Drifted off', DriftScreen],
  ['blocked', 'Locked app', BlockedScreen],
  ['sky', 'Sky', SkyScreen],
  ['nova', 'Nova', NovaScreen],
  ['cosmos', 'The year', CosmosScreen],
  ['atlas', 'Astro atlas', AtlasScreen],
  ['connect', 'Assistants', AssistantsScreen],
  ['pro', 'Pro', ProScreen],
];

const CAPS = {
  lock: ['Lock screen.', ' A Live Activity, not a notification: the task above the timer, the star pulsing beside it, and one sentence of encouragement that changes as the session runs.'],
  today: ['Today.', ' Ticking a task grows the star in place — the list and the reward are the same object. Tap the circles to watch it grow.'],
  plan: ['Proposal.', ' Written by Claude over MCP and held until you approve. No star is lit before you say yes.'],
  focus: ['The forge.', ' Dust drifts inward for as long as you stay; the timer sits inside the star, not on top of it. Nothing to tap.'],
  drift: ['Drifted off.', ' The inflow freezes and clarity drops — the star never dies. A soft question, then one large button back.'],
  blocked: ['Locked app.', ' When the app opens again is the biggest thing on screen. The star is shown burning, never as a threat.'],
  sky: ['Sky.', ' Size is tasks finished, light is plan kept, colour is the project — so a month is legible without a single number. Rings mark days where every block held, comets mark comebacks, wisps are rest days. Turn on constellations to see which nights are still missing from Orion, and tap any star for its day.'],
  nova: ['Nova.', ' The reward for a perfect week — seven kept nights fuse into one named, dated, permanent star. It arrives with a shockwave and a ring; nothing else in the app looks like it.'],
  cosmos: ['The year.', ' The camera pulls back on load: three arms, 341 nights, one galaxy you can only get by turning up.'],
  atlas: ['Astro atlas.', ' Each constellation expands into the project it was made of, with its star and clarity.'],
  connect: ['Assistants.', ' They may plan and read the sky. They may never unlock an app or dim a star.'],
  pro: ['Pro.', ' Free forges one star a day. Pro is the whole sky.'],
};

function App() {
  const [id, setId] = React.useState('focus');
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
        <div data-sf-kit="true">
          <PhoneFrame theme="dark">
            <ScreenView go={go} />
          </PhoneFrame>
        </div>
        <p className="cap"><b>{CAPS[id][0]}</b>{CAPS[id][1]}</p>
      </div>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
