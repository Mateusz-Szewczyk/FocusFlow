# Marketing kit

`index.html` — the FocusFlow landing page, built only from system components
(`Headline`, `Note`, `Label`, `Numeral`, `Button`, `Rule`, `SegmentedControl`,
`StatRow`, `BulletItem`, `Tree`, `Grove`, `ShareArt`). Layout lives in `page.jsx`
as a column of full-width bands; bands alternate `--paper` and `--room` and
nothing introduces a colour, radius or shadow outside the tokens.

Bands: hero · growth rule (1·1·2·3·5·8) · three steps · grove proof (week /
month / year, interactive) · share art · pricing · footer.

Components load through `../../_ds_bundle.js`, which compiles the `.jsx` sources
in `components/` at run time — edit a component and the page follows.
