# FocusFlow iOS — POC

The thinnest vertical slice that answers one question: **can the block actually be built?**
One session, plain UI, on a physical iPhone. No star, no sky, no assistant, no backend.

> **This code has never been compiled.** It was written on Windows, where Xcode does not
> exist. Treat every Swift file as a reviewed draft until step 3 below. Expect to fix
> things; that is the plan, not a failure of it.

## Prerequisites

| | Why |
| --- | --- |
| A **physical iPhone** | Screen Time APIs do not work in the Simulator. `requestAuthorization` fails there. |
| A **Mac** you control | Xcode is macOS-only, and the iPhone must be attached to it. A cloud Mac cannot host your phone, so it does not work for this POC. |
| **Apple Developer Program** | Enrolment gates the Family Controls capability. |

## Getting it running

```sh
brew install xcodegen
cd ios
# set DEVELOPMENT_TEAM in project.yml to your Team ID first
xcodegen
open FocusFlow.xcodeproj
```

Then, in Xcode:

1. Confirm **Family Controls** and **App Groups** are enabled on all three targets, and
   that the App Group ID matches `SessionStore.appGroup`.
2. If `group.com.focusflow.shared` is taken, change it in `project.yml` *and*
   `Shared/SessionStore.swift` together.
3. Build. Fix what the compiler finds — see *Known soft spots* below.
4. Run on the device (not the Simulator).

## Targets

| Target | Role |
| --- | --- |
| `FocusFlow` | The app. Authorize, pick apps, name the task, start, count down. |
| `FocusFlowMonitor` | `DeviceActivityMonitor`. Lifts the shield when the window ends. |
| `FocusFlowShield` | `ShieldConfiguration`. Draws the block screen with the task name. |

`Shared/` is compiled into all three — the extensions need the same store and the same
shield controller the app uses.

## Design tokens

`Shared/Generated/DesignTokens.swift` is generated, not written:

```sh
node tools/gen-tokens.mjs     # from the repo root
```

It reads `tokens/*.css`, resolves `var()` chains, and emits the night palette, spacing,
radius, durations and type sizes. Edit the CSS, never the Swift. 77 tokens currently
emit; 18 skip (font stacks, cubic-beziers, em tracking) and are reported on each run.

## Verification — the POC passes when all seven hold

Use a genuinely distracting app, and a 5-minute duration so the loop is quick.

1. Launch → authorization prompt → approve.
2. Pick two apps. Relaunch the app; the selection survived.
3. Task "Writing the finance report", 5 minutes, **Start**.
4. Leave FocusFlow, open a blocked app → **the shield appears and names the task**.
5. An app you did *not* pick still opens normally.
6. **Force-quit FocusFlow.** Wait out the window. The blocked app opens again.
7. Reboot mid-session, repeat 4 → the shield still holds.

**6 and 7 are the real test.** Steps 1–5 can be faked by an app that stays alive; these
cannot. If either fails, the scheduling model is wrong — and that finding is the entire
point of building this.

## Known soft spots

Written without a compiler, so these are the places to look first:

- **`onChange(of: controller.selection)`** in `RootView` needs `FamilyActivitySelection` to
  be `Equatable`. If it is not, observe an explicit revision counter instead.
- **Swift 6 strict concurrency** may complain about the `static let` names in
  `SessionStore` if `DeviceActivityName` / `ManagedSettingsStore.Name` are not `Sendable`.
  Drop the target to `SWIFT_STRICT_CONCURRENCY: targeted` if it becomes a fight — the POC
  is not the place to win that argument.
- **`DeviceActivitySchedule` works in wall-clock components**, not durations, so a session
  crossing midnight is clamped. Fine for minute-long POC runs; wrong for the real product.
- **Shield not updating between sessions** is a known platform rough edge. If seen, use a
  distinct `ManagedSettingsStore(named:)` per session rather than reusing one.
- **Principal classes** in `project.yml` must match the class names exactly
  (`MonitorExtension`, `ShieldConfigurationExtension`) or the extensions never load —
  and they fail silently.

## What this deliberately is not

The star and sky · Live Activity · MCP server and the assistant · backend, accounts, sync ·
the wait-before-unlock mechanic · GRDB · onboarding · anything shippable.

See `../docs/tech-stack.md` for why, and for the three platform constraints that shape the
product rather than just the code.
