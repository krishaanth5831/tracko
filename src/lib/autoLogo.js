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

export function autoEmoji(name) {
  for (const [pattern, emoji] of LOGO_MAP) {
    if (pattern.test(name)) return emoji
  }
  return '📅'
}
