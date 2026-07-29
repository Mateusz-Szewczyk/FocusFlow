# design-sync notes

## Shape: `prebuilt` — the converter does not apply here

This repo is not a design-system *source* repo. It was seeded from a Claude Design
export that is already in the upload contract, so there is no `package.json`, no
`dist/`, and no Storybook. `package-build.mjs` has nothing to build.

The repo root *is* the bundle directory: `_ds_bundle.js`, `styles.css`, `tokens/`,
`components/`, `guidelines/`, `ui_kits/`. Upload from `localDir: "."`.

## What the bundle actually is

`_ds_bundle.js` is a **runtime loader**, not a compiled bundle. It:

- synchronously XHRs each `components/<cat>/<Name>.jsx`,
- strips the `import` lines and rewrites `export` declarations,
- compiles with `@babel/standalone` and memoises the output in `localStorage`,
- exposes `window.DS` (aliased `window.FF`) plus a `window.dsLoadScripts(urls)` helper.

Consequences worth knowing before changing anything:

- **React, ReactDOM and Babel come from unpkg over the network.** There is no
  `_vendor/` directory. If previews ever render blank in an environment with a
  strict CSP, vendor those three files and rewrite the `<script src>` tags in the
  five `components/*/*.card.html` files and `ui_kits/star_forge/index.html`.
- The `.jsx` files are the single source of truth — nothing is pre-compiled, so
  editing a component is enough; there is no build step to re-run.
- `viewport` is declared per card in the `@dsCard` first-line comment.

## Verifying locally

There is no npm script. Serve the repo root over HTTP (the loader's XHR will not
work over `file://`) and open the pages in a browser:

    node .design-sync/serve.mjs   # if kept; otherwise any static server on the root

Check `ui_kits/star_forge/index.html` (click through the eleven chips), the five
`components/*/*.card.html`, and the `guidelines/colors-*.html` cards.

## Theming — the trap

Night is the default (`:root`). Light is opt-in via `[data-theme="light"]`.

`PhoneFrame` renders an inner `<div data-theme={theme}>`. Custom properties declared
on that inner element **beat anything inherited from an ancestor**, so wrapping a
subtree in a palette does not reach inside a PhoneFrame. That is why
`[data-theme="dark"]` in `tokens/colors.css` restates the night values in full
rather than relying on inheritance — do not "simplify" it away.

The Star Forge page chrome sets `data-theme="light"` on `<body>` because the room
around the device is light while the screen inside is night.

## Guideline cards print hardcoded hexes

The `guidelines/colors-*.html` cards paint swatches from live `var(--*)` but print
the hex as literal text underneath. Changing a token value silently makes those
labels lie. Update both sides together.
