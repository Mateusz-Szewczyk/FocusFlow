# Star Forge kit

`index.html` — eleven screens. Product logic is unchanged: the assistant writes the
day over MCP, you approve it, a session protects the time and locks distracting
apps, progress accumulates. What you earn is a star.

## The mapping (statistics ARE the drawing)
- **Size** = tasks finished from the day's list (`mass` 0–1).
- **Light / clarity** = how well the timer and plan were kept (`clarity` 0–1).
  Low clarity adds fog over the light — it never darkens to nothing and never dies.
- **Colour** = the project the day belonged to. Five hues, one legend line, so a
  month says *what* you worked on before you read a single number.
- **Artifacts** — rare forms a day can earn, never random decoration:
  - **ring** — every planned block kept that day (the one people will chase),
  - **binary** — two projects held in balance,
  - **comet** — the first day back after a break, arriving with a tail,
  - **wisp** — a rest day: present and unlit, never a gap.
- **Nova** = a perfect week. Seven kept nights fuse into one named, dated,
  permanent star with a double ring and a shockwave. It goes on the atlas shelf and
  is the only object in the app that animates on arrival. `WeekMeter` shows the
  tension all week ("5 of 7 nights kept · nova at seven").
- **Constellations** = milestones linking days; missing nights are dashed sockets.
- **A year** = the galaxy: three arms, coloured by the mix of projects.

## Files
- `sky.jsx` — `Star`, `Forge` (star + drifting dust), `Sky` (spiral of days +
  constellation overlay), `Cosmos` (the year). Radial gradients and plain circles
  only, one blur filter per svg, so a screen full of stars stays cheap.
- `screens.jsx` — the eleven screens; every one is `Screen > Body` over a gradient
  nebula veil, reusing system components with the night palette.
- `app.jsx` — chip gallery, captions, phone stage.

## Motion
All animation is CSS, all of it slow (4.6 s pulse, 7–12 s dust drift, 90 s swirl,
220 s galaxy rotation) and all of it respects `prefers-reduced-motion`.
- `.sf-mote` — dust drifts from the rim to the core along a per-mote vector; the
  motes are what visibly *feeds* the star.
- `.sf-stalled` — a distraction pauses dust, pulse and swirl mid-flight
  (`animation-play-state: paused`), so the freeze itself is the feedback.
- `.sf-draw` — constellation lines draw themselves in when the overlay opens.
- `.sf-zoom` — the year view pulls the camera back on load.
- `.sf-twinkle`, `.sf-fill` — background life and the Live Activity progress bar.

## Palette
Night tokens live in `index.html` under `[data-sf-kit]` and remap the system's
`--paper`/`--ink-*`/`--accent`, so shared components inherit the direction. If this
becomes the product, they move into `tokens/colors.css` as the default theme.
