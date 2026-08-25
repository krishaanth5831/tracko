# tracko — agent guide

Browser-only dashboard of event-countdown and money-goal cards. React 19 + Vite 8 + Tailwind v4, JavaScript/JSX, npm, Node 20+. **No backend, no accounts, no environment variables** — all state lives in `localStorage` under the versioned key `tracko:v1`.

## Commands (the gate)

```bash
npm install
npm run dev     # vite
npm run lint    # oxlint
npm run build   # vite build   <- the deploy gate (CI runs npm ci && npm run build)
```

No typecheck, no test runner, no format script — don't invent them. `npm run lint && npm run build` is the whole gate; `CONTRIBUTING.md` requires a passing build before a PR.

## Non-negotiable repo rules

- **Storage schema:** `src/state/storage.js` owns the versioned localStorage schema. Any shape change requires a version bump **and** a migration — silently changing it destroys real user data.
- **~5 MB localStorage budget.** `src/lib/imageUpload.js` downscales originals for this reason. Never store an un-downscaled image or a large blob.
- Keep it dependency-light: plain React + SVG + CSS before any new package.
- Vite `base` is `/tracko/` (GitHub Pages). Asset paths must respect it; don't hardcode `/`.
- **Commits:** imperative subjects, e.g. `Add pixel logo, ambient screensaver, goal vizzes, and custom logo upload`.

## Map

| Path | What it is | Safe to parallelize? |
|---|---|---|
| `src/components/events/` | countdown modes (`countdownModes.jsx` + `COUNTDOWN_MODES` in `src/lib/countdown.js`) | Yes |
| `src/components/goals/` | goal visualizations (`vizzes.jsx`: `VIZ_COMPONENTS` + `GOAL_VIZZES`) | Yes |
| `src/lib/` | domain utilities (`autoLogo.js` `LOGO_MAP`, `countdown.js`, `imageUpload.js`) | Yes, by file |
| `src/state/` | localStorage state and schema | No — hotspot |
| `src/App.jsx` | app shell and wiring | No — hotspot |
| `public/` | icons, `manifest`, `sw.js` (registered in production only) | Yes |
| `docs/PRD.md`, `.github/` | spec, issue templates, deploy workflow | Yes |

Read before editing: `CONTRIBUTING.md` (it documents the exact extension points), `docs/PRD.md`, `vite.config.js`, `.oxlintrc.json`, then the specific registry you're extending.

Do not hand-edit / do not read into context: `package-lock.json`, `dist/`, `dist-ssr/`, `node_modules/`, icons and images.

## The extension points (use these instead of inventing structure)

1. **Auto-logo:** add a `[/regex/i, '🎹']` row to `LOGO_MAP` in `src/lib/autoLogo.js`. First match wins — specific keywords above generic ones.
2. **Countdown mode:** component in `src/components/events/countdownModes.jsx` taking `{ date, now }`, registered in `MODE_COMPONENTS` and in `COUNTDOWN_MODES` (`src/lib/countdown.js`) with `tick: 'second' | 'minute'`.
3. **Goal visualization:** component in `src/components/goals/vizzes.jsx` taking `{ progress, size }` (progress 0–1), registered in `VIZ_COMPONENTS` plus a `{ id, label }` row in `GOAL_VIZZES`. SVG whose fill is a rect clipped to the outline — see `MoneySack.jsx`. Monochrome outline, one accent color for the fill. Cards, focus view and the form preview pick it up automatically.
4. **3D focus scene:** publish a grayscale-friendly Spline scene, add its URL to `SCENES` and a `[regex, scene]` row to `SCENE_MAP` in `src/components/Spline3D.jsx`.

## Gotchas

- The README/PRD roadmap is **stale**: PWA, sharing, themes and extra visualizations listed as "future" already exist in `src/`. Trust the code, not the roadmap; fix the doc if your change makes it wronger.
- `public/sw.js` is only registered in production (`src/main.jsx`) — service-worker bugs won't show in `npm run dev`.
- CI (`deploy.yml`) only builds and deploys Pages on `main`; it does **not** run lint. Lint locally.

---

# Working with agents in this repo

## Token discipline

1. `rg` for the registry or symbol name, then read only that range (`sed -n 'A,Bp'`). Don't open a file to discover what's in it.
2. Read a whole file only if it's <~200 lines or you're rewriting most of it.
3. Never read the do-not-read list above.
4. Never re-read a file you already read this session.
5. Verify narrowest-first: `npm run lint`, then one `npm run build` at the end. There are no tests to run — check behaviour in the browser instead, once.
6. Pipe noisy output (`npm run build 2>&1 | tail -30`). Paste failing lines, never a whole build log.
7. Close out a unit of work with a <=15-line summary of decisions + file paths, then drop the exploration transcript.

## Parallel execution: orchestrator + workers

The registries above are near-perfect parallel units: N new visualizations or countdown modes = N workers, each owning one component plus one registry row. Fan out when >=2 units touch disjoint files; stay single-agent when the work is a chain (schema change -> state -> UI).

The orchestrator writes no feature code. It:

1. Splits along the map/registries above.
2. **Freezes contracts first, itself:** the `{ progress, size }` / `{ date, now }` component props, the storage schema, and any shared helper signature. Commit them to the integration branch before workers start. A worker needing a contract change stops and reports.
3. Owns everything in `src/state/`, `src/App.jsx` and the lockfile — these are single-writer. Do the schema change and migration *before* fan-out, never in parallel with it.
4. Hands each worker its own worktree, port and brief. 2-4 concurrent.
5. Reviews each diff, merges in dependency order, runs `npm run lint && npm run build` once, opens the PR.

Because every worker adds a row to the **same registry object**, expect trivial conflicts there: keep additions append-only at the end of the registry, and resolve during integration — that's the orchestrator's job, not a reason to serialize the work.

Worker brief (under ~20 lines — the worker reads this file; don't re-explain the repo):

```
Goal:            <one sentence, observable outcome>
Worktree:        ../tracko-<slug>   Branch: agent/<slug>   Dev port: 5174+
Files you own:   <your component file> + the one registry row
Do not touch:    package-lock.json, src/state/**, src/App.jsx, other workers' components
Contracts:       component props + registry shape (read-only)
Done when:       npm run lint && npm run build pass, and the card + focus view render it
Report:          diff summary, commands run, assumptions made
Stop and ask if: the storage schema would need to change, or work spills outside your files
```

Anti-patterns: two workers editing `src/state/storage.js`; a worker bumping the schema version on its own; a worker running `npm install`; parallelizing a schema migration.

## One worktree per agent

Agents must never share a working tree — concurrent edits, `git switch` and installs clobber each other.

```bash
# orchestrator, once
git fetch origin && git switch -c integration/<task> origin/main && git push -u origin integration/<task>

# per worker
git worktree add ../tracko-<slug> -b agent/<slug> integration/<task>
cd ../tracko-<slug> && npm ci      # node_modules is NOT shared across worktrees
npm run dev -- --port 5174         # unique port per worker; dist/ is per-worktree already
```

- One worktree per worker, `../tracko-<slug>`, branch `agent/<slug>`; the worker stays inside it.
- Unique dev port per worker — two Vite servers otherwise fight over 5173 (Vite silently increments, and then your screenshots come from the wrong app).
- Each worktree has its own `localStorage` origin only if the port differs — another reason ports must be unique when testing data changes.
- Integrate by merging `agent/*` into `integration/<task>`, then one PR into `main` (Pages deploys from `main`). Workers never push to `main` and never merge each other.
- Clean up: `git worktree remove ../tracko-<slug>`, then `git worktree prune`.

## Done means

`npm run lint` and `npm run build` pass; existing `tracko:v1` data still loads (or a migration handles it); the diff contains nothing unrelated; `CONTRIBUTING.md`/`README.md` updated if you added an extension point or changed user-visible behaviour.
