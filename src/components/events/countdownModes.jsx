import { getDiff, getCalendarParts } from '../../lib/countdown.js'

function Unit({ value, label }) {
  return (
    <div className="flex flex-col items-center min-w-14">
      <span className="text-3xl font-bold tabular-nums">{String(value).padStart(2, '0')}</span>
      <span className="text-xs uppercase tracking-wider text-white/50">{label}</span>
    </div>
  )
}

export function DaysOnly({ date, now }) {
  const d = getDiff(date, now)
  return (
    <div className="flex flex-col items-center">
      <span className="text-6xl font-extrabold tabular-nums">{d.totalDays}</span>
      <span className="text-sm text-white/60">
        {d.totalDays === 1 ? 'day' : 'days'} {d.past ? 'ago' : 'left'}
      </span>
    </div>
  )
}

export function Detailed({ date, now }) {
  const p = getCalendarParts(date, now)
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-3">
        <Unit value={p.months} label="months" />
        <Unit value={p.days} label="days" />
        <Unit value={p.hours} label="hours" />
      </div>
      {p.past && <span className="text-sm text-white/60">ago</span>}
    </div>
  )
}

export function LiveTimer({ date, now }) {
  const d = getDiff(date, now)
  const totalHours = d.days * 24 + d.hours
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-baseline gap-1 text-4xl font-bold tabular-nums">
        <span>{String(totalHours).padStart(2, '0')}</span>
        <span className="text-white/40">:</span>
        <span>{String(d.minutes).padStart(2, '0')}</span>
        <span className="text-white/40">:</span>
        <span>{String(d.seconds).padStart(2, '0')}</span>
      </div>
      <span className="text-xs uppercase tracking-wider text-white/50">
        hrs : min : sec {d.past ? 'ago' : ''}
      </span>
    </div>
  )
}

export function FullTimer({ date, now }) {
  const d = getDiff(date, now)
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-2">
        <Unit value={d.days} label="days" />
        <Unit value={d.hours} label="hrs" />
        <Unit value={d.minutes} label="min" />
        <Unit value={d.seconds} label="sec" />
      </div>
      {d.past && <span className="text-sm text-white/60">ago</span>}
    </div>
  )
}

export const MODE_COMPONENTS = {
  days: DaysOnly,
  detailed: Detailed,
  live: LiveTimer,
  full: FullTimer,
}
