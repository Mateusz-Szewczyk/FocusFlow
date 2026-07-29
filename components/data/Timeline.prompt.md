The day (or a proposed plan) as a vertical thread.

```jsx
<Timeline items={[
  { time: '08:30', name: 'Rewrite lecture notes', state: 'done' },
  { time: '18:00', name: 'Review chapter 3', state: 'now' },
  { time: '19:00', name: 'Free time' },
]} />
```

Rest and free time are listed as blocks, never as gaps. Cap the list at five and end with a "+23 · See the rest" row rather than scrolling — this product never shows a feed.
