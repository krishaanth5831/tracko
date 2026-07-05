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

The money sack lives in `src/components/goals/MoneySack.jsx` — it's an SVG whose fill is a rect clipped to the sack shape, driven by a `progress` prop (0–1). New visualizations (thermometer, jar, ring) can follow the same pattern.

## Guidelines

- Keep it dependency-light — prefer plain React + SVG + CSS.
- All data must stay in localStorage (schema in `src/state/storage.js`). Bump the version and add a migration if you change it.
- Run `npm run build` before opening a PR to make sure it compiles.

## Ideas / bugs

Open an issue! Feature ideas are very welcome — that's the whole point of this being open source.
