import { useEffect, useState } from 'react'

const KEY = 'tracko:ui'
const DEFAULTS = { open: [], active: 'home', order: [], alerts: false }

function loadUi() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY))
    if (Array.isArray(data?.open) && typeof data?.active === 'string') {
      return { ...DEFAULTS, ...data }
    }
  } catch {
    /* fall through */
  }
  return DEFAULTS
}

// Browser-style tabs ('home' plus one tab per opened tracker id) + device-local
// UI prefs: home-grid card order and the T-0 alerts toggle.
export function useTabs(validIds) {
  const [ui, setUi] = useState(loadUi)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ui))
  }, [ui])

  // Drop tabs whose tracker was deleted
  useEffect(() => {
    setUi((u) => {
      const open = u.open.filter((id) => validIds.has(id))
      if (open.length === u.open.length) return u
      return { ...u, open, active: validIds.has(u.active) ? u.active : 'home' }
    })
  }, [validIds])

  return {
    open: ui.open,
    active: ui.active,
    order: ui.order,
    alerts: ui.alerts,
    openTab: (id) =>
      setUi((u) => ({
        ...u,
        open: u.open.includes(id) ? u.open : [...u.open, id],
        active: id,
      })),
    closeTab: (id) =>
      setUi((u) => ({
        ...u,
        open: u.open.filter((t) => t !== id),
        active: u.active === id ? 'home' : u.active,
      })),
    goTo: (id) => setUi((u) => ({ ...u, active: id })),
    setOrder: (order) => setUi((u) => ({ ...u, order })),
    toggleAlerts: () => setUi((u) => ({ ...u, alerts: !u.alerts })),
  }
}

// Sort tracker items by the persisted card order; unknown ids keep their
// natural position at the end.
export function sortByOrder(items, order) {
  if (!order.length) return items
  const pos = new Map(order.map((id, i) => [id, i]))
  return [...items].sort(
    (a, b) => (pos.get(a.id) ?? order.length) - (pos.get(b.id) ?? order.length)
  )
}
