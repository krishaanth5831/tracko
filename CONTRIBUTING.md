# Contributing to Tracko

Thanks for your interest! Tracko is intentionally small and beginner-friendly.

## Getting started

```bash
git clone https://github.com/krishaanth5831/tracko.git
cd tracko
npm install
npm run dev
```

No backend, no environment variables — the app runs entirely in the browser.

## Easy contributions

### Add an auto-logo mapping

Open `src/lib/autoLogo.js` and add a row to `LOGO_MAP`:

```js
[/piano|recital/i, '🎹'],
```

First match wins, so put specific keywords above generic ones.

### Add a countdown display mode

1. Add a component in `src/components/events/countdownModes.jsx` that takes `{ date, now }`.
2. Register it in `MODE_COMPONENTS` and in `COUNTDOWN_MODES` (`src/lib/countdown.js`) with a `tick` of `'second'` or `'minute'`.

### Add a goal visualization

Goal visualizations (money sack, thermometer, jar, ring) are swappable — the user picks one per goal in the goal form. Adding a new one is one component plus one registry row, both in `src/components/goals/vizzes.jsx`:

1. Write a component that takes `{ progress, size }` (`progress` is 0–1, `size` is Tailwind size classes). The existing ones are SVGs whose fill is a rect clipped to the shape's outline — see `MoneySack.jsx` for the technique. Keep the outline monochrome; one accent color for the fill is fine.
2. Register it in `VIZ_COMPONENTS` and add a `{ id, label }` row to `GOAL_VIZZES`.

Cards, the fullscreen focus view, and the form's picker (which renders a live mini preview at 65%) all pick it up automatically.

## Guidelines

- Keep it dependency-light — prefer plain React + SVG + CSS.
- All data must stay in localStorage (schema in `src/state/storage.js`). Bump the version and add a migration if you change it.
- Run `npm run build` before opening a PR to make sure it compiles.

## Ideas / bugs

Open an issue! Feature ideas are very welcome — that's the whole point of this being open source.
