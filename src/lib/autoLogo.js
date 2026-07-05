// To add a new auto-logo, add a row here: [regex of keywords, emoji].
// First match wins, so put more specific keywords higher up.
const LOGO_MAP = [
  [/birthday|bday|b-day/i, '🎂'],
  [/wedding|marriage/i, '💍'],
  [/exam|test|finals?|midterm|sat\b|gre\b/i, '📚'],
  [/graduat/i, '🎓'],
  [/flight|plane|airport/i, '✈️'],
  [/trip|travel|vacation|holiday/i, '🏖️'],
  [/concert|music|festival|gig/i, '🎵'],
  [/movie|film|premiere/i, '🎬'],
  [/game|match|tournament|final\b/i, '🏆'],
  [/launch|release|drop/i, '🚀'],
  [/christmas|xmas/i, '🎄'],
  [/new year/i, '🎆'],
  [/diwali/i, '🪔'],
  [/interview|job/i, '💼'],
  [/deadline|due|submit/i, '⏰'],
  [/doctor|dentist|appointment/i, '🏥'],
  [/party|celebration/i, '🎉'],
  [/race|marathon|run\b/i, '🏃'],
  [/anniversary/i, '💖'],
  [/moving|move\b/i, '📦'],
]

const COLORS = [
  '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
  '#3b82f6', '#ef4444', '#06b6d4', '#f97316',
]

export function autoEmoji(name) {
  for (const [pattern, emoji] of LOGO_MAP) {
    if (pattern.test(name)) return emoji
  }
  return '📅'
}

export function autoColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0
  return COLORS[Math.abs(hash) % COLORS.length]
}
