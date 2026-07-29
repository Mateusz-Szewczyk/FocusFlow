The FocusFlow action set — one jade primary per screen, everything else quiet.

```jsx
<Button onClick={start}>Start</Button>
<Button variant="quiet">Finished early</Button>
<Button variant="tiny">Not now</Button>
<Button variant="inline">ChatGPT proposed 26 blocks · review</Button>
```

- `primary` and `quiet` are full width block buttons; `tiny` is the full-width mono escape hatch beneath them; `inline` is an underlined link in prose.
- Copy is a plain verb or short sentence, sentence case, never shouty and never shaming: "Send back with fixes", not "FIX MY PLAN!".
- Destructive or punishing labels do not exist in this product.
