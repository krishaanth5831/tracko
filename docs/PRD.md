# Tracko — Product Requirements Document

## Vision

A playful personal dashboard where every important date and goal gets its own beautiful, glanceable card.

## Users

- **Primary:** individuals tracking personal dates (exams, trips, birthdays) and goals (savings targets).
- **Secondary:** open-source contributors adding tracker types and logo mappings.

## Core features (v1)

### F1 — Event countdowns

- Create event: name, date (+ optional time), optional emoji/color override.
- **Auto-logo:** a keyword matcher maps the event name to an emoji ("birthday" → 🎂, "exam" → 📚, "flight/trip" → ✈️, default 📅) plus an auto-assigned accent color. Both can be overridden.
- Countdown display modes, chosen per event:
  | Mode | Shows | Ticks |
  |---|---|---|
  | Days only | big day count | per minute |
  | Detailed | months / days / hours (calendar-aware) | per minute |
  | Live timer | hours : minutes : seconds | per second |
  | Full timer | days : hours : minutes : seconds | per second |
- Past events show "ago" instead of negative numbers.
- Events can be edited and deleted.

### F2 — Money sack goal tracker

- Create tracker: name, target amount, currency symbol, emoji (default 💰).
- Add contributions (amount + optional note, auto-dated); history list with per-item delete.
- **Sack visualization:** an SVG sack fills bottom-up proportionally to progress, animated, with a percentage label. Confetti fires when crossing 100%.
- Built as a *tracker type* so future visualizations (thermometer, jar, ring) can be contributed.

### F3 — Dashboard

- Single-page responsive grid mixing event and goal cards.
- "+ Add" flow with type picker (Event / Goal).
- Friendly empty state.

### F4 — Data

- All state in localStorage under one versioned key (`tracko:v1`).
- Export / Import JSON for backups.

### F5 — Open source readiness

- README, CONTRIBUTING guide, MIT license, issue templates.
- Auto-deploy to GitHub Pages via GitHub Actions.

## Data model

```js
{
  version: 1,
  events: [{ id, name, date, emoji, color, autoLogo, mode, createdAt }],
  goals:  [{ id, name, target, currency, emoji, contributions: [{ id, amount, note, date }], createdAt }]
}
```

## Out of scope for v1 (roadmap)

Accounts/sync, notifications/reminders, recurring events, PWA/offline install, shareable links, additional tracker visualizations, theme switching.

## Success criteria

- Each of the 4 countdown modes shows correct, live values (including past events).
- Adding money animates the sack fill; confetti at 100%.
- Data survives a page refresh; export → clear → import restores everything.
- Public repo with green CI deploying to GitHub Pages.
