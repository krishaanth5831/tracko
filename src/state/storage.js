const KEY = 'tracko:v1'

export const emptyState = { version: 1, events: [], goals: [] }

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyState
    const data = JSON.parse(raw)
    if (data?.version !== 1) return emptyState
    return { ...emptyState, ...data }
  } catch {
    return emptyState
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function exportState(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `tracko-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function parseImport(text) {
  const data = JSON.parse(text)
  if (data?.version !== 1 || !Array.isArray(data.events) || !Array.isArray(data.goals)) {
    throw new Error('Not a valid Tracko backup file')
  }
  return { ...emptyState, ...data }
}
