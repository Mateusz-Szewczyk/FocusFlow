# Family Controls entitlement — request and review notes

`com.apple.developer.family-controls` is the entitlement that lets FocusFlow shield apps.
**Distribution** requires Apple's approval, reviewed over weeks, and it can be refused —
which makes it the single dependency on the critical path that we do not control.

Submit at: <https://developer.apple.com/contact/request/family-controls-distribution>

> **Sequence.** Enrol in the Apple Developer Program → confirm the Family Controls
> capability appears for a *development* profile (this is usually enough to build and test
> the POC on your own device) → submit the distribution request anyway, on day one. A
> refusal is far cheaper to discover before the app is built than after.

---

## Draft: what the app does

FocusFlow is a focus timer that enforces the block a person has already agreed to.

A person connects FocusFlow to an AI assistant (ChatGPT or Claude) over MCP and asks for a
plan — for example, two weeks of revision before an exam. The plan arrives in the app as a
proposal. The person approves it with one tap. From then on, each scheduled block protects
its own time: the apps the person selected are shielded for the duration of the block, and
the block screen names the task they chose to work on.

The apps to shield are chosen by the person, in Apple's own `FamilyActivityPicker`. We
never see which apps they are — the tokens are opaque to us — and we do not attempt to
infer them. Nothing outside the person's own selection is ever shielded, so calls,
messages, Maps, banking and two-factor authentication apps stay available throughout.

## Draft: why the Screen Time API is required

The product's premise is that a plan should be able to defend its own time. Planning apps
know what someone intended to do but cannot prevent them opening a distracting app;
blocking apps can close an app but have no idea what the person meant to be doing.
FocusFlow is the join between the two, and the shielding half has no implementation on iOS
other than `FamilyControls`, `ManagedSettings` and `DeviceActivity`.

Specifically we use:

- `FamilyControls` — `.individual` authorization, and `FamilyActivityPicker` so the person
  selects their own apps.
- `ManagedSettings` — a single named store, shielding only the selected tokens for the
  duration of an approved block.
- `DeviceActivity` — a non-repeating schedule per session, so the shield lifts on time even
  if the app is not running.
- `ManagedSettingsUI` — a `ShieldConfiguration` that names the task the person chose,
  because naming the intended work is the product's entire reason to exist.

We do not use `DeviceActivityReport`. FocusFlow deliberately shows no screen-time
statistics; it reports finished work, not usage.

## Draft: individual use, not parental control

FocusFlow requests `.individual` authorization. It is used by adults on their own device,
for their own commitments — students and professionals with a dated goal. There is no
parent/child relationship, no remote administrator, and no third party who can impose a
block on someone else's phone.

An assistant may propose a schedule and may make a block stricter. It can never end,
shorten or weaken a block that is already running. That is enforced structurally: the MCP
tool surface has no capability to do so, and the device treats every remote instruction as
a proposal that it is free to reject. Only the person, on the phone, can end a session.

---

## App Store review notes

Include with the submission:

> FocusFlow uses the Screen Time API to shield applications during focus sessions the user
> has explicitly started on their own device.
>
> To reproduce: launch the app and grant Screen Time access when prompted. Tap "Apps to
> close" and select one or more apps in the system picker. Enter a task name, choose a
> duration, and tap Start. The selected apps are shielded for that duration and show a
> block screen naming the task. Apps that were not selected are unaffected. The session
> ends automatically at the end of the chosen duration, or immediately via "Finish early".
>
> All app selection is performed by the user in Apple's `FamilyActivityPicker`. The app
> does not receive, store, or transmit the identity of the selected applications — the
> tokens are opaque. No usage statistics are collected or displayed.
>
> Authorization is `.individual`. There is no parental-control or supervisory
> relationship; the user is shielding their own device by their own choice.

## Notes on tone

Two things are worth being precise rather than promotional about, because both are
genuinely true of the design and both answer the reviewer's likely objection:

1. **The user picks the apps, always.** The assistant plans *when*, never *what*.
2. **Nothing can lock a person out of their own phone.** Only the selected apps are
   shielded, the session is time-boxed, and the person can end it.
