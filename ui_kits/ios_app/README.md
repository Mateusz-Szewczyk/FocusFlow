# FocusFlow — iOS UI kit

Eleven screens of the app, rebuilt from the v0.4 prototype on top of the design-system
components. Open `index.html`; the chip rail switches screens and the toggle flips the
whole shell (and the phone) to night.

| File | Screens |
| --- | --- |
| `shell.jsx` | `Screen` / `Body` / `Pad` helpers, **Today**, **Proposal** |
| `focus.jsx` | **Session**, **Day grew**, **Blocked**, **Growth rule**, **Evening** |
| `grove.jsx` | **Grove** (week/month/year), **Share**, **Assistants**, **Pro** |

Screens are plain browser-transpiled JSX, not modules: each file declares its screens and
assigns them to `window` at the end. `window.FF` resolves the compiled component bundle.

## Screen map

- **Today** — the next block as the headline, today's tree beside it, the rest of the day as a thread.
- **Proposal** — a plan that arrived over MCP, held until one tap approves it. Amber bullets flag conflicts.
- **Session** — dark. Breathing ring, no tree: growing it is the reward, never the pressure.
- **Day grew** — the tree branches; height / leaves / colour are restated in plain English.
- **Growth rule** — the Fibonacci ladder as a row of trees.
- **Blocked** — the biggest thing on screen is when the app reopens. The tree is never mentioned here.
- **Grove** — week row, month stand, year horizon.
- **Share** — one exportable image in three crops. No task names, app names or times.
- **Evening** — desaturated, leaves drifting, the day planted.
- **Assistants** — what an assistant can and can never do.
- **Pro** — pricing, framed as making the lock honest.

## Known simplifications

- The Today sapling is positioned by layout rather than the prototype's runtime alignment to the countdown hairline.
- Month and year stands are deterministic sample data (seeded), not a real calendar.
