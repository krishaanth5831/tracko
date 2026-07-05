import { getDiff, getCalendarParts } from '../../lib/countdown.js'
import { FlipClock } from './FlipClock.jsx'

function Stat({ value, label }) {
  return (
    <div className="flex flex-col items-center min-w-16">
      <span className="text-4xl font-bold tabular-nums tracking-tight">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mono text-[9px] text-white/35 mt-1">{label}</span>
    </div>
  )
}

export function DaysOnly({ date, now }) {
  const d = getDiff(date, now)
  return (
    <div className="flex flex-col items-center">
      <span className="text-7xl font-bold tabular-nums tracking-tighter">{d.totalDays}</span>
      <span className="mono text-[10px] text-white/35 mt-2">
        {d.totalDays === 1 ? 'day' : 'days'} {d.past ? 'ago' : 'left'}
      </span>
    </div>
  )
}

export function Detailed({ date, now }) {
  const p = getCalendarParts(date, now)
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-4">
        <Stat value={p.months} label="months" />
        <Stat value={p.days} label="days" />
        <Stat value={p.hours} label="hours" />
      </div>
      {p.past && <span className="mono text-[10px] text-white/35">ago</span>}
    </div>
  )
}

export function LiveTimer({ date, now }) {
  const d = getDiff(date, now)
  const totalHours = d.days * 24 + d.hours
  return (
    <div className="flex flex-col items-center gap-2">
      <FlipClock
        size="lg"
        units={[
          { value: totalHours, label: 'hrs' },
          { value: d.minutes, label: 'min' },
          { value: d.seconds, label: 'sec' },
        ]}
      />
      {d.past && <span className="mono text-[10px] text-white/35">ago</span>}
    </div>
  )
}

export function FullTimer({ date, now }) {
  const d = getDiff(date, now)
  return (
    <div className="flex flex-col items-center gap-2">
      <FlipClock
        units={[
          { value: d.days, label: 'days' },
          { value: d.hours, label: 'hrs' },
          { value: d.minutes, label: 'min' },
          { value: d.seconds, label: 'sec' },
        ]}
      />
      {d.past && <span className="mono text-[10px] text-white/35">ago</span>}
    </div>
  )
}

export const MODE_COMPONENTS = {
  days: DaysOnly,
  detailed: Detailed,
  live: LiveTimer,
  full: FullTimer,
}
