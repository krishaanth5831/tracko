# ⏳ Tracko

**Countdowns & goals, at a glance.**

Tracko is a tiny open-source dashboard where every important date and goal gets its own glanceable card:

- 📅 **Event countdowns** — type an event name and Tracko auto-picks a logo for it ("Birthday" → 🎂, "Trip to Japan" → 🏖️). Pick your countdown style:
  - **Days only** — one big number
  - **Months / days / hours** — calendar-aware breakdown
  - **Live timer** — hours : minutes : seconds, ticking
  - **Full timer** — days : hours : minutes : seconds
- 💰 **Money goals** — set a target and watch a money sack literally fill up as you add to it. Confetti when you hit 100%. 🎉
- 🔒 **Your data stays yours** — everything lives in your browser's localStorage. Export/Import JSON for backups. No accounts, no server.

**Live app:** https://krishaanth5831.github.io/tracko/

> 📸 Screenshot/demo GIF coming soon

## Run it locally

```bash
git clone https://github.com/krishaanth5831/tracko.git
cd tracko
npm install
npm run dev
```

## Tech

Vite + React + Tailwind CSS, plain JavaScript, no backend. See [docs/PRD.md](docs/PRD.md) for the full product spec.

## Contributing

Ideas and PRs welcome! Some easy entry points:

- Add a keyword → emoji mapping to the auto-logo table (`src/lib/autoLogo.js`)
- Add a new countdown display mode (`src/components/events/countdownModes.jsx`)
- Add a new goal visualization (thermometer? jar? progress ring?)

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Roadmap

- [ ] More goal visualizations (thermometer, jar, ring)
- [ ] Recurring events (birthdays every year)
- [ ] Notifications / reminders
- [ ] Themes
- [ ] PWA / installable offline app
- [ ] Shareable countdown links

## License

[MIT](LICENSE)
