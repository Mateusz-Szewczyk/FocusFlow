# Dream Traveler kit

`index.html` — twelve screens of the pet-and-journey direction. Product logic is
unchanged from the grove build: the assistant writes the day over MCP, you approve
it, a session locks the phone, progress accumulates. Only the reward changed.

## Files
- `art.jsx` — the illustration layer: watercolour washes (turbulence + blur SVG
  filters), the pet in three postures (`curled`, `waking`, `walking`), `Trail`,
  `Globe`, `Postcard`. Dog vs cat differs in ears, muzzle and tail.
- `screens.jsx` — the twelve screens. Every screen is `Screen > Backdrop > Body`
  and reuses system components (`Button`, `Headline`, `Note`, `Label`, `Numeral`,
  `Timeline`, `StatRow`, `BulletItem`, `SegmentedControl`, `StatusBar`, `TabBar`).
- `app.jsx` — chip gallery, captions, phone stage.

## The three psychological pillars, in the UI
1. **Empathy, not points** — the sleeping pet is the largest object on the focus
   screen; the timer sits under it. Copy is care ("Shh · deep sleep"), never score.
2. **Tangible progress** — distance and place replace levels. Landscape changes as
   the total grows (lane → dune road → mist), postcards unlock by kilometre.
3. **No death penalty** — a broken session shows `StirredScreen`: the pet lifted
   her head, time remaining is stated plainly, and the primary action is "Back to
   sleep". Nothing wilts, nothing is deleted.

## Palette
Pastel tokens live in `index.html` under `[data-dt-kit]` and remap the system's
`--accent`/`--ink-*`/`--paper` so the shared components inherit the watercolour
direction. `[data-dt-mood="dusk"|"alert"]` shifts a single screen. If the direction
is approved these move into `tokens/colors.css` as a second theme.
