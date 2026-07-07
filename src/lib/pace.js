const DAY = 86400000

// Linear saving pace since the first contribution → estimated finish date.
// Null when there isn't enough history for a meaningful estimate.
export function paceEstimate(goal, now = Date.now()) {
  const total = goal.contributions.reduce((s, c) => s + c.amount, 0)
  if (goal.target <= 0 || total >= goal.target || goal.contributions.length < 2) return null
  const first = Math.min(...goal.contributions.map((c) => new Date(c.date).getTime()))
  const elapsed = now - first
  if (elapsed < DAY / 2) return null
  const perDay = total / (elapsed / DAY)
  const daysLeft = (goal.target - total) / perDay
  if (!isFinite(daysLeft) || daysLeft <= 0 || daysLeft > 3650) return null
  return new Date(now + daysLeft * DAY)
}

// Total contributed in the trailing 7 days.
export function savedThisWeek(goal, now = Date.now()) {
  return goal.contributions
    .filter((c) => now - new Date(c.date).getTime() < 7 * DAY)
    .reduce((s, c) => s + c.amount, 0)
}
