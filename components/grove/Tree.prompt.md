One day of protected time drawn as one tree — the core visual mechanic of FocusFlow; use it anywhere a day, a session result or a streak would otherwise be a number.

```jsx
<Tree stage={4} green={3} size={2.1} seed={12} />
```

- `stage` is Fibonacci: 1·1·2·3·5·8 blocks kept. Stage `-1` is a planted rest day (a low moss arc, never a gap), `0` is a seedling.
- `green` is kept ÷ planned. Two of two kept is `green={3}` even on a short tree; eight planned and three kept is tall and `green={1}`.
- `seed` must be stable per day — the same day always draws the same tree.
- Never wither, delete or shrink an existing tree to signal failure. That punishment mechanic is banned.
- For rows, stands and horizons use `Grove`; for custom artwork compose `treeNode()` inside your own `<svg>`.
