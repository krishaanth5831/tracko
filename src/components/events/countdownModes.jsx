import { getDiff, getCalendarParts } from '../../lib/countdown.js'
import { FlipClock } from './FlipClock.jsx'

function Stat({ value, label, big }) {
  return (
    <div className={`flex flex-col items-center ${big ? 'min-w-28' : 'min-w-16'}`}>
      <span className={`font-bold tabular-nums tracking-tight ${big ? 'text-8xl' : 'text-4xl'}`}>
        {String(value).padStart(2, '0')}
      </span>
      <span className={`mono text-white/35 mt-1 ${big ? 'text-xs mt-3' : 'text-[9px]'}`}>{label}</span>
    </div>
  )
}

function Ago({ past, big }) {
  if (!past) return null
  return <span className={`mono text-white/35 ${big ? 'text-xs' : 'text-[10px]'}`}>ago</span>
}

export function DaysOnly({ date, now, big }) {
  const d = getDiff(date, now)
  return (
    <div className="flex flex-col items-center">
      <span
        className={`font-bold tabular-nums tracking-tighter ${
          big ? 'text-[12rem] leading-none sm:text-[16rem]' : 'text-7xl'
        }`}
      >
        {d.totalDays}
      </span>
      <span className={`mono text-white/35 ${big ? 'text-sm mt-6' : 'text-[10px] mt-2'}`}>
        {d.totalDays === 1 ? 'day' : 'days'} {d.past ? 'ago' : 'left'}
      </span>
    </div>
  )
}

export function Detailed({ date, now, big }) {
  const p = getCalendarParts(date, now)
  return (
    <div className={`flex flex-col items-center ${big ? 'gap-4' : 'gap-1'}`}>
      <div className={`flex ${big ? 'gap-10' : 'gap-4'}`}>
        <Stat value={p.months} label="months" big={big} />
        <Stat value={p.days} label="days" big={big} />
        <Stat value={p.hours} label="hours" big={big} />
      </div>
      <Ago past={p.past} big={big} />
    </div>
  )
}

export function LiveTimer({ date, now, big }) {
  const d = getDiff(date, now)
  const totalHours = d.days * 24 + d.hours
  return (
    <div className={`flex flex-col items-center ${big ? 'gap-6' : 'gap-2'}`}>
      <FlipClock
        size={big ? 'xl' : 'lg'}
        units={[
          { value: totalHours, label: 'hrs' },
          { value: d.minutes, label: 'min' },
          { value: d.seconds, label: 'sec' },
        ]}
      />
      <Ago past={d.past} big={big} />
    </div>
  )
}

export function FullTimer({ date, now, big }) {
  const d = getDiff(date, now)
  return (
    <div className={`flex flex-col items-center ${big ? 'gap-6' : 'gap-2'}`}>
      <FlipClock
        size={big ? 'xl' : 'md'}
        units={[
          { value: d.days, label: 'days' },
          { value: d.hours, label: 'hrs' },
          { value: d.minutes, label: 'min' },
          { value: d.seconds, label: 'sec' },
        ]}
      />
      <Ago past={d.past} big={big} />
    </div>
  )
}

export const MODE_COMPONENTS = {
  days: DaysOnly,
  detailed: Detailed,
  live: LiveTimer,
  full: FullTimer,
}
