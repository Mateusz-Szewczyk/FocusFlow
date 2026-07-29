# FocusFlow Design System

**FocusFlow** is an iOS app that turns a plan written by an AI assistant into protected,
enforced time — and shows what you actually finished.

You connect FocusFlow inside ChatGPT or Claude over MCP and ask for a plan ("two weeks of
revision before my exam"). The plan arrives in the app as a proposal; one tap approves it.
From then on each block defends itself: distracting apps close for the hour while calls,
messages, Maps, banking and 2FA stay open. At the end of the week you get finished work,
not a screen-time chart.

**Positioning:** *Your assistant plans it. Your phone keeps it.*

**Why it exists:** planners know what you should be doing but can't stop you opening TikTok.
Blockers can close TikTok but have no idea what you were meant to be doing. FocusFlow knows
both — its block screen names the task you chose.

**The safety promise:** an assistant may propose plans and make a block stricter; it can
never end, shorten or weaken a running lock. Only the person, on the phone, after a wait.

**Audience:** 18–35, students and young professionals who already use an assistant daily,
have a dated goal (exam, thesis, portfolio, launch), and have installed and deleted a
blocker before because it punished them.

## Sources

Everything here was derived from three artefacts pasted into the project by the product owner:

1. **FocusFlow — UI prototype v0.4 · the grove** (single-file HTML, 11 screens, generative SVG grove).
2. **FocusFlow — flyer** (single-file HTML marketing sheet, A4 print rules).
3. **The product brief** — positioning, audience, grove mechanic and the "Visual system — follow this exactly" spec.

No codebase, Figma file, font binaries or logo assets were supplied. See *Caveats* at the end.

---

## CONTENT FUNDAMENTALS

**Voice: calm, adult, never shaming.** After a broken day the app says *"tomorrow you can start
with a shorter block"* — never *"you failed, you lost your streak."* There is no streak language,
no congratulation, no exclamation mark and no emoji anywhere in the product.

**Headlines are short sentences with a full stop.** "Today branched." · "The day is planted." ·
"They plan the hour. Only you open it." · "Make the lock honest." Sentence case always; the only
uppercase in the system is the mono micro-label.

**Numbers are spoken, not measured.** "17 of 20 blocks." not "85% completion". "all of your plan"
not "100%". "in 26 minutes, on its own" not "26:00 remaining". If a number doesn't change what you
do next, it is cut.

**Second person, present tense, plain verbs.** Buttons: *Start · Approve · Send back with fixes ·
Finished early · Not now · Stay on Free*. Never *Get started!*, never *Crush your goals*.

**Middots separate clauses** in mono labels: `NEXT · 18:00`, `THIRD BLOCK KEPT · 50 MINUTES`,
`431 H PROTECTED · 612 THINGS FINISHED`. Times are 24-hour.

**The product states its own limits out loud.** "No prompt gets you out of a lock. That is the lock."
"Task names, app names and times never leave the phone." Honesty is the tone, not a legal footer.

**Copy that is banned:** streaks, wither/die/lose, shame or guilt framing, gamified praise, urgency,
"unlock your potential", any second-person imperative that implies the user is failing.

---

## VISUAL FOUNDATIONS

**Colour.** Night is the default: pale blue-white ink on deep indigo. Ink `#EEF1FF`, secondary
`#A7AFD8`, tertiary `#7C84B4`, paper `#0B0E20`, raised `#131739`, hairline
`rgba(190,203,255,.16)`. The accent (`--accent-base`, `#8C9BE8`) appears **once per screen** —
the primary button, or the running-block dot, never both. **Leaf** (`#8FD0BE`) is foliage only
and never appears outside a tree. **Amber** (`#E0B36A`) marks care and conflict, never
decoration.

The original grove palette — ink `#171E1B` on paper `#F5F4EF`, jade accent `#3D6D5B` — is
preserved under `[data-theme="light"]`. It is what the *room* around the device uses (the
prototype page chrome, print), not the product. Themes nest in both directions: a night screen
sits inside a light shell via `[data-theme="dark"]`, and a light panel sits inside the night
default via `[data-theme="light"]`.

**Type.** Display is a warm bookish serif — Iowan Old Style / Palatino Linotype / Palatino /
Book Antiqua / Georgia — always weight 400, tracking `-0.012em`, leading 1.16. Sizes 42 / 32 / 24 / 19.
Body is the system sans at 13–15px with 1.8 leading, capped around 46 characters. Every time,
counter, duration, unit and label is monospace, uppercase, 8.5–10.5px, tracked 0.16–0.26em.
Numerals are tabular so they never jitter. A time is never set in the serif.

**Layout.** Hairlines and whitespace instead of cards and shadows. 30px side padding on a 390pt
screen, 30px of air either side of every rule, 15px rows. One primary action per screen; everything
else is a ghost button, a tiny mono link or an inline underline. Never a scrolling feed. Never a
dashboard of six numbers.

**Backgrounds.** Flat paper. The **only** gradient in the system is sky (`#E9EAE1 → #F6F5EF` light,
`#0B100F → #141A18` dark) behind grove artwork, with a `#E1E4D8` sun disc drifting on a 90s cycle.
No photography, no illustration fills, no texture, no noise.

**Imagery is line art only.** Trees are drawn procedurally: quadratic stems, teardrop leaves,
1.1–1.7px strokes, round caps, deterministic per-day seeds. Distant trees are the same routine at
0.2–0.4 scale and 30% opacity behind a mist rectangle. Nothing is ever filled.

**Corners & borders.** 15px buttons, 16px artwork, 20px cards, 38px device screen, 46px bezel,
999px pills. Borders are always exactly 1px `--hairline` — there is no 2px state, no focus fill,
no coloured border. Focus is a 2px jade outline offset 3px.

**Elevation.** Effectively none. The only shadows in the system belong to physical objects: the
device bezel (`0 44px 90px -38px`) and a printed sheet (`0 34px 74px -40px`). Inside a screen,
separation is always a hairline. No inner shadows, no blur, no transparency effects.

**Cards.** Only two exist: the share card (20px radius, sky fill, 1px hairline) and the printed
flyer sheet. Content is never wrapped in a card to group it — use a rule.

**Motion is weather, not feedback.** Nothing pops, bounces or celebrates.
Trees sway continuously, 3–7s cycles at 2–5.5°, each offset so the canopy never pulses in unison;
taller trees lean further and slower. Trees grow from the ground: trunk ~0.95s, each fork ~30%
quicker than the last, leaves fastest — a branch never appears before the limb it hangs from.
The session ring breathes on a 15s sine. Screens arrive with a fade and a 10px rise over 0.9s.
Leaves occasionally drift down on the evening screen (22–34s falls). Everything respects
`prefers-reduced-motion`.

**States.** Hover is opacity `.88` or a single step up in ink — never a colour change, never a
transform, never a shadow. Press has no dedicated treatment. Selected chips and segments invert to
solid ink (never jade). Disabled states barely occur; the product prefers to explain instead.

---

## ICONOGRAPHY

**There is no icon set, and that is deliberate.** Both source artefacts contain zero icons, zero
icon fonts and zero emoji. Navigation is mono-caps words (`TODAY · GROVE · YOU`), state is ink
weight, and the only glyphs anywhere are:

- **Drawn UI furniture** — the status-bar dots and battery outline, and 4–5px dots for bullets and timeline stops. These are `<span>` shapes and `<line>` elements, not icons.
- **Generative line art** — trees, leaves, ridges, understory, sun disc, breathing ring. All produced by `Tree`, `Grove`, `ShareArt` and `BreathRing`; never hand-drawn per screen.
- **Two unicode characters**, used only in the prototype's theme toggle: `◑` and `◐`.

Do not introduce Lucide, SF Symbols, Heroicons or any other set. If something needs a symbol, it
needs a word.

**Logo:** none was supplied. The wordmark is set in type — "FocusFlow" in the display serif, or
`FOCUSFLOW` in tracked mono caps at 7.5px in artwork. Do not draw a leaf mark.

---

## Index

| Path | What it is |
| --- | --- |
| `styles.css` | The entry point consumers link. `@import`s only. |
| `tokens/` | `colors` · `typography` · `spacing` · `radius` · `motion` (+ shared keyframes) · `elevation` |
| `guidelines/` | 17 foundation specimen cards — Colors, Type, Spacing, Brand |
| `components/core/` | `Button` `Chip` `SegmentedControl` `Rule` |
| `components/type/` | `Headline` `Label` `Note` `Numeral` |
| `components/data/` | `StatRow` `BulletItem` `Timeline` `Countdown` |
| `components/shell/` | `PhoneFrame` `StatusBar` `TabBar` |
| `components/grove/` | `Tree` `Grove` `BreathRing` `ShareArt` |
| `ui_kits/star_forge/` | **The direction** — eleven screens. Star per day, colour = project, nova = perfect week |
| `ios/` | The POC app — one real block session. See `ios/README.md`; the Swift is an uncompiled draft |
| `tools/gen-tokens.mjs` | Generates `ios/Shared/Generated/DesignTokens.swift` from `tokens/*.css` |
| `docs/tech-stack.md` | iOS stack decision, and the three Screen Time constraints that shape the product |
| `docs/entitlement-request.md` | Family Controls justification for Apple, plus App Store review notes |
| `github.md` | Source-repo association and sync receipt |
| `SKILL.md` | Agent-skill entry point |

### Intentional additions

- **`Rule`** — the sources use a bare `<hr>` everywhere; promoted to a component so the 30px rhythm is enforced.
- **`PhoneFrame`** — prototype chrome, kept so screens can be shown out of context without re-drawing a bezel.

---

## Caveats

- **Fonts.** Iowan Old Style and the system sans stacks are OS fonts; no binaries were supplied, so there are no `@font-face` rules. On non-Apple platforms display type falls back to Palatino/Georgia, which is close but heavier. If you want the exact specimen everywhere, send the licensed files or pick a Google substitute (Petrona and Source Serif 4 are the nearest matches).
- **No logo or brand assets** were provided, so `assets/` is empty and the wordmark is typographic.
- **Star Forge is the chosen direction.** The grove, dream-traveler and marketing kits that once sat beside it have been retired; they remain in git history if a comparison is ever needed again.
- **The night palette is now the default theme**, promoted out of `[data-sf-kit]` into `tokens/colors.css` under `:root`. The light grove palette is preserved under `[data-theme="light"]` and is no longer what a component renders by default.
- Month and year skies use seeded sample data, not a real calendar.
