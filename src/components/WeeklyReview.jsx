import { effectiveDate, getDiff } from '../lib/countdown.js'
import { savedThisWeek } from '../lib/pace.js'

// Monday-morning review strip: closest event, fastest-growing goal, total
// saved in the trailing week. Renders only on Mondays (or with ?review).
export function WeeklyReview({ events, goals }) {
  const now = Date.now()
  const monday = new Date(now).getDay() === 1
  const forced = new URLSearchParams(window.location.search).has('review')
  if (!monday && !forced) return null

  const upcoming = events
    .map((e) => ({ e, ms: new Date(effectiveDate(e, now)).getTime() }))
    .filter((x) => x.ms > now)
    .sort((a, b) => a.ms - b.ms)[0]

  const grower = goals
    .map((g) => ({ g, saved: savedThisWeek(g, now) }))
    .filter((x) => x.saved > 0)
    .sort((a, b) => b.saved - a.saved)[0]

  const totalSaved = goals.reduce((s, g) => s + savedThisWeek(g, now), 0)
  if (!upcoming && totalSaved === 0) return null

  const fmt = (g, n) => `${g.currency}${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`

  return (
    <div className="card rounded-2xl px-5 py-4 pop-in sm:col-span-2 lg:col-span-3 flex flex-wrap items-center gap-x-8 gap-y-2">
      <span className="mono text-[10px] text-white/40">Weekly review</span>
      {upcoming && (
        <span className="mono text-[10px] text-white/70">
          Next up · {upcoming.e.name} in {getDiff(effectiveDate(upcoming.e, now), now).totalDays}d
        </span>
      )}
      {grower && (
        <span className="mono text-[10px] text-white/70">
          Fastest goal · {grower.g.name} +{fmt(grower.g, grower.saved)}
        </span>
      )}
      {totalSaved > 0 && goals[0] && (
        <span className="mono text-[10px] text-white/70">
          Saved this week · {fmt(goals[0], totalSaved)}
        </span>
      )}
    </div>
  )
}
