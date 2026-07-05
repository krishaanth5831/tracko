const MS = { second: 1000, minute: 60000, hour: 3600000, day: 86400000 }

export function getDiff(targetISO, now) {
  const target = new Date(targetISO).getTime()
  const past = target < now
  const abs = Math.abs(target - now)
  return {
    past,
    totalDays: Math.floor(abs / MS.day),
    days: Math.floor(abs / MS.day),
    hours: Math.floor((abs % MS.day) / MS.hour),
    minutes: Math.floor((abs % MS.hour) / MS.minute),
    seconds: Math.floor((abs % MS.minute) / MS.second),
  }
}

// Calendar-aware months + remaining days (not totalDays / 30).
export function getCalendarParts(targetISO, now) {
  let from = new Date(now)
  let to = new Date(targetISO)
  const past = to < from
  if (past) [from, to] = [to, from]

  let months =
    (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
  const anchor = new Date(from)
  anchor.setMonth(anchor.getMonth() + months)
  if (anchor > to) {
    months--
    anchor.setMonth(anchor.getMonth() - 1)
  }
  const rem = to - anchor
  return {
    past,
    months,
    days: Math.floor(rem / MS.day),
    hours: Math.floor((rem % MS.day) / MS.hour),
  }
}

export const COUNTDOWN_MODES = [
  { id: 'days', label: 'Days only', tick: 'minute' },
  { id: 'detailed', label: 'Months / days / hours', tick: 'minute' },
  { id: 'live', label: 'Live timer (h:m:s)', tick: 'second' },
  { id: 'full', label: 'Full timer (d:h:m:s)', tick: 'second' },
]
