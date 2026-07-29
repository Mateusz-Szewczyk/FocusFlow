# Tech stack

**Status:** proposed · **Date:** 2026-07-29 · **Scope:** iOS first

FocusFlow is an iOS app that turns a plan written by an AI assistant into protected,
enforced time. This document records which stack we chose, which we rejected, and the
three platform constraints that shape the product rather than just the code.

---

## The constraint that decides everything

The core promise — *distracting apps close for the hour* — has exactly one supported
implementation on iOS: Apple's **Screen Time API** family.

- `FamilyControls` — authorization, and the system app picker
- `ManagedSettings` — the store that actually applies a shield
- `DeviceActivity` — schedule-driven callbacks into a system-launched extension
- `ManagedSettingsUI` — the block screen's content

There is no alternative, no private API worth shipping, and no web equivalent. These
frameworks are **Swift-only and extension-based**: the blocking does not run inside the
app, it runs in app extensions the system launches on its own schedule, under tight
memory budgets.

That reframes the usual question. It is not "React Native vs Flutter vs native" — it is
"how much of this app is *not* the blocking engine, and is that worth a second runtime?"

For FocusFlow: not much, and no.

---

## Options considered

| Option | Verdict |
| --- | --- |
| **React Native / Expo** | Community wrappers for Screen Time exist, but the monitor, shield-configuration and shield-action extensions must still be written in Swift. You would maintain a bridge, an extension suite *and* a JS runtime, to ship an app whose defining feature lives entirely on the Swift side. |
| **Flutter** | The same extension problem, a thinner ecosystem for these specific APIs, and a rendering model that fights UIKit-hosted system UI. |
| **Capacitor / PWA** | Cannot block applications at all. Non-starter. |
| **Native Swift** | The blocking engine is native no matter what is chosen. Choosing native removes the bridge, not the work. |

**On Android later.** Android's `UsageStatsManager` plus accessibility-service blocking is
a different and weaker enforcement model — not a port, a re-think. The genuinely shared
layer across platforms is the backend and the design language, neither of which a
cross-platform UI framework would have given us.

---

## The stack

### App

- **Swift 6, SwiftUI**, strict concurrency, `async/await`.
- **Minimum iOS 17** (18 preferred). iOS 16 is the floor for `.individual` Screen Time
  authorization; 17+ buys the `@Observable` macro and the `Canvas` / shader maturity the
  Star Forge rendering wants.

### Targets

| Target | Job |
| --- | --- |
| Main app | SwiftUI. Plan review, session control, the sky and atlas. |
| `DeviceActivityMonitor` extension | Session start/end. Applies and lifts shields. |
| `ShieldConfiguration` extension | The block screen's content. |
| `ShieldAction` extension | Handles taps on the shield's buttons. |
| Widget extension | Live Activity for the running block (the kit's `.sf-fill` bar). |

**Deliberately skipped: the `DeviceActivityReport` extension.** It is the most awkward of
the set, and FocusFlow explicitly rejects screen-time charts — *"if a number doesn't change
what you do next, it is cut."* The brand deletes our hardest extension.

### Shared state

**App Group container + GRDB (SQLite), not SwiftData.**

Three extensions read the same store, and the monitor extension runs under a
single-digit-megabyte memory cap and must respond quickly. GRDB with WAL is predictable
under those conditions; SwiftData container setup inside constrained extensions is the
kind of thing that fails at 6am on someone's phone rather than in review.

- `FamilyActivitySelection` tokens → App Group `UserDefaults` (they are `Codable`)
- Session and plan history → GRDB
- Credentials → Keychain with an access group shared across targets

### Rendering the star

**SwiftUI `Canvas` inside `TimelineView`.** The year view is roughly 341 points of light,
comfortably within Canvas. Escalate to a Metal shader via `.layerEffect` only if the
forge's glow demands it. No SVG, no WebView.

All motion stays slow and honours Reduce Motion, matching the kit: 4.6s pulse, 7–12s dust
drift, 90s swirl, 220s galaxy rotation.

### Backend

- **TypeScript**, using the official `@modelcontextprotocol/sdk` — the most mature MCP
  implementation, and already our ecosystem.
- **Postgres** for plans, sessions and accounts.
- **Fly.io or Railway** for hosting.
- **Sign in with Apple** for auth.
- **APNs** to tell the phone a plan has arrived.

---

## The MCP surface *is* the safety promise

The product promise is: *an assistant may propose plans and make a block stricter; it can
never end, shorten or weaken a running lock. Only the person, on the phone, after a wait.*

Encode that as **absence**, not as a check. The server exposes:

- `propose_plan` — submit a plan for the person to approve
- `get_schedule` — read what is planned
- `strengthen_block` — make a block stricter

and simply **has no tool that can end or shorten a session**. A capability that does not
exist cannot be misused, prompt-injected, or regressed by a later refactor.

Then enforce it a second time on-device: the phone treats every remote instruction as a
*proposal*, and rejects any weakening while a session is live. The server is never
authoritative over an active lock.

---

## Three constraints that shape the product

These are not implementation details. Each one changes what can be designed.

### 1. The Family Controls entitlement is the critical path

`com.apple.developer.family-controls` requires a distribution request to Apple, with
review, measured in weeks — and it can be refused. Everything else here is buildable on
our own schedule; this is the one dependency we do not control.

**Apply in week one, before writing app code.** Be precise in the request and in the App
Store review notes about why an app that blocks other apps is doing so on the user's own
instruction.

### 2. The block screen cannot show the star

`ShieldConfiguration` is a fixed system template: background colour and blur style, an
icon, a title, a subtitle, and up to two buttons. Arbitrary SwiftUI cannot be rendered
in it.

- **Works:** *"its block screen names the task you chose"* — that is the subtitle, exactly
  as the brief describes.
- **Does not work:** the star, the drifting dust, the generative art.

The most brand-defining moment in the product is the one screen the Star Forge visual
language cannot reach. This needs a design decision, not a workaround — probably: make the
shield quiet and typographic, and let the star do its work on either side of the block.

### 3. The assistant cannot choose which apps to block

Application tokens from `FamilyActivityPicker` are **opaque**. We never see bundle
identifiers, and a selection cannot be constructed programmatically — only the person can
pick, in Apple's own picker UI.

So "two weeks of revision before my exam" produces a **schedule**, while the block list
stays something the person sets by hand, once. The assistant plans *when*, never *what*.

This is a real constraint on the pitch, and it happens to reinforce the privacy stance
rather than fight it: we could not build a screen-time profile of someone even if we
wanted to.

### And one honest limit

A determined person can delete the app. The lock is a commitment device, not DRM. The
*"never shaming, only you, after a wait"* positioning is already compatible with that —
the risk is marketing drifting into promising enforcement the OS cannot provide.

---

## From this design system to the app

This repository is React. It is a **design surface** — it feeds the Claude Design agent so
every mock is made of real FocusFlow parts — not shippable iOS code.

The durable bridge is **tokens, not components**:

- Run `tokens/*.css` through Style Dictionary to emit a Swift `Color` / spacing / radius
  enum, so `--accent-base`, the night palette and the spacing scale have exactly one
  source of truth across web mocks and the app.
- Components get re-implemented in SwiftUI. `Headline`, `Label`, `Note`, `Numeral`,
  `Button`, `Chip` and `SegmentedControl` are small and map cleanly.
- `Tree`, `Grove`, `Star`, `Forge`, `Sky` and `Cosmos` become `Canvas` drawing code — the
  `.jsx` in `ui_kits/star_forge/sky.jsx` is the specification for that work.

Night is the app's default theme (`:root` in `tokens/colors.css`). The light grove palette
under `[data-theme="light"]` is the room around the device — prototype chrome and print,
not product.

---

## First moves

1. **Request the Family Controls distribution entitlement.** Nothing else is on the
   critical path; this is.
2. Prove the spike end to end before building product: authorize, pick apps in
   `FamilyActivityPicker`, schedule a `DeviceActivity` window, shield on
   `intervalDidStart`, lift on `intervalDidEnd`, and show a custom subtitle in the shield.
   That single loop de-risks the entire product.
3. Stand up the MCP server with `propose_plan` only, and connect it to Claude or ChatGPT.
4. Then, and only then, start on the sky.

Steps 2 and 3 are independent and can run in parallel.
