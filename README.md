# Tracko

**Countdowns & goals, at a glance.**

Tracko is a tiny open-source dashboard where every important date and goal gets its own glanceable card. Strict black & white, flip-clock aesthetics, zero accounts, zero servers — your data never leaves your device.

**Live app:** https://krishaanth5831.github.io/tracko/

> 📸 Screenshot/demo GIF coming soon

## Features

### 📅 Event countdowns
- **Four display styles** — days only · calendar-aware months/days/hours · live h:m:s · full d:h:m:s
- **Fliqlo-style flip clock** with real split-flap animation, plus a departure-board "boot cascade" every time a clock appears
- **Recurring events** — mark a birthday as yearly (or weekly/monthly) and the date rolls forward automatically after it passes
- **T-0 moment** — when a countdown hits zero the card invert-flashes, confetti fires, and the event gets an `ARRIVED` badge
- **T-0 alerts** (optional, footer toggle) — a chime and a system notification the second any countdown lands
- **Auto-logos** — type "Trip to Japan" and get 🏖️; or pick a real photo (Openverse search) or upload your own picture

### 💰 Money goals
- **Nine visualizations**, picked per goal: money sack · thermometer · jar (lid pops at 100%) · progress ring · battery · pixel grid · skyline (builds floor by floor) · orbit (one lap per 10%) · vault (door swings open on a pile of gold)
- **Milestone confetti** — quiet monochrome puffs at 25/50/75%, full gold at 100%
- **Pace estimate** — "at this rate → Mar 12" computed from your contribution history
- **Liquid ripple** when a contribution lands, animated count-up percentages
- Contribution history with notes, per-goal currency

### 🖥️ Focus mode & screensaver
- Click any card for a **fullscreen focus view**; names type themselves in split-flap style
- Click the backdrop to use the tracker's **photo as a fullscreen background**
- **Ambient screensaver** — after 5 idle seconds all chrome fades away, leaving a pure clock (with a slow Ken Burns drift on photo backgrounds). Any input wakes it. Fliqlo on your spare monitor.
- **Zen mode** — add `?zen` to the URL to start the screensaver immediately, or `?zen&cycle=30` to rotate through all your open tabs every 30 seconds like a slideshow

### 🧭 Quality of life
- **Browser-style tabs** — home grid plus one persistent tab per opened tracker
- **⌘K / Ctrl+K command palette** — create trackers, jump anywhere, export, all from the keyboard
- **Drag to reorder** cards on the home grid (grab the ⠿ handle)
- **Shareable links** — copy a link that carries the whole tracker in the URL; the recipient gets a preview and one-click "Add to my Tracko". No server involved — the link *is* the data.
- **Weekly review** — a Monday-morning strip with your next event, fastest-growing goal, and total saved this week
- **Export / Import** JSON backups
- **Installable PWA** — works fully offline (see below)

### 🔒 Your data stays yours
Everything lives in your browser's localStorage. No accounts, no analytics, no backend. Export a JSON backup anytime.

## 📱 Install it on your phone

Tracko is a PWA: installed once, it opens fullscreen like a native app, works completely offline, and keeps your data on the device.

### iPhone / iPad

1. Open **Safari** (it must be Safari — Chrome and Firefox on iOS can't install web apps) and go to https://krishaanth5831.github.io/tracko/
2. Tap the **Share** button — the square with the up-arrow in the middle of the bottom toolbar. (If the toolbar is hidden, tap the bottom edge of the screen.)
3. Scroll down the share sheet and tap **Add to Home Screen**. Can't see it? Tap **Edit Actions…** at the bottom of the sheet and enable it there.
4. You'll see the Tracko icon and name — tap **Add** in the top-right corner.
5. Launch it from your home screen. It opens edge-to-edge black with no browser bars.

**Good to know on iOS:**
- Open it once while online so it finishes caching — after that, airplane mode is fine.
- Want T-0 alerts? Tap `alerts off` in the footer and allow notifications (requires iOS 16.4+, and only fires while the app is open — there's no background process).
- Bedside clock: open a tracker, wait 5 seconds for the screensaver, and set Settings → Display & Brightness → Auto-Lock → Never.

### Android

1. Open **Chrome** and go to https://krishaanth5831.github.io/tracko/
2. Chrome usually shows an **"Install app"** banner or prompt on its own — tap it. If it doesn't:
3. Tap the **⋮ menu** (top-right) → **Add to Home screen** (on some versions it says **Install app**) → confirm with **Install**.
4. Launch Tracko from your home screen or app drawer — it runs in its own window, shows up in the app switcher, and works offline.

Samsung Internet, Edge, and Firefox on Android also support this — look for "Add to Home screen" or "Install" in the browser menu.

### Moving your data to the phone

Trackers are stored per device (there's no sync). To bring your existing ones over:

- **Everything:** tap **Export** on your computer, send yourself the JSON file, then **Import** it in the phone app.
- **One tracker:** hover a card → tap **⤴** → send yourself the copied link → open it on the phone → **Add to my Tracko**.

## Run it locally

```bash
git clone https://github.com/krishaanth5831/tracko.git
cd tracko
npm install
npm run dev
```

## Tech

Vite + React + Tailwind CSS, plain JavaScript, no backend. 3D: CSS-3D for the exploding pixel-logo hero, lazy-loaded [Spline](https://spline.design) scenes for focus-view backgrounds. See [docs/PRD.md](docs/PRD.md) for the full product spec.

## Contributing

Ideas and PRs welcome! Some easy entry points:

- Add a keyword → emoji mapping to the auto-logo table (`src/lib/autoLogo.js`)
- Add a goal visualization — one component + one registry row (`src/components/goals/vizzes.jsx`)
- Add a countdown display mode (`src/components/events/countdownModes.jsx`)
- Add a keyword → 3D scene mapping for focus backgrounds (`src/components/Spline3D.jsx`)

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Roadmap

- [x] More goal visualizations (nine and counting)
- [x] Recurring events (birthdays every year)
- [x] Notifications / chime at T-0
- [x] PWA / installable offline app
- [x] Shareable countdown links
- [x] Ambient screensaver mode
- [x] Drag-to-reorder, command palette, weekly review
- [ ] Themes (light mode? accent colors?)
- [ ] Cross-device sync (end-to-end encrypted?)
- [ ] Home-screen widgets
- [ ] Background push reminders

## License

[MIT](LICENSE)
