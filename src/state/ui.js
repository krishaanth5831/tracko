import { useEffect, useState } from 'react'

const KEY = 'tracko:ui'

function loadUi() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY))
    if (Array.isArray(data?.open) && typeof data?.active === 'string') return data
  } catch {
    /* fall through */
  }
  return { open: [], active: 'home' }
}

// Browser-style tabs: 'home' plus one tab per opened tracker id.
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
      return { open, active: validIds.has(u.active) ? u.active : 'home' }
    })
  }, [validIds])

  return {
    open: ui.open,
    active: ui.active,
    openTab: (id) =>
      setUi((u) => ({
        open: u.open.includes(id) ? u.open : [...u.open, id],
        active: id,
      })),
    closeTab: (id) =>
      setUi((u) => ({
        open: u.open.filter((t) => t !== id),
        active: u.active === id ? 'home' : u.active,
      })),
    goTo: (id) => setUi((u) => ({ ...u, active: id })),
  }
}
