import { useEffect, useMemo, useRef, useState } from 'react'

// Cmd/Ctrl+K command menu: new event, new goal, jump to any tracker.
// `actions` = [{ id, label, hint?, run }]
export function CommandPalette({ actions }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef(null)

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? actions.filter((a) => a.label.toLowerCase().includes(q)) : actions
  }, [actions, query])

  useEffect(() => {
    // capture phase so Escape here doesn't also exit the focus view
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
        setQuery('')
        setCursor(0)
      } else if (open && e.key === 'Escape') {
        e.stopPropagation()
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  if (!open) return null

  function onInputKey(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => Math.min(c + 1, matches.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => Math.max(c - 1, 0))
    } else if (e.key === 'Enter' && matches[cursor]) {
      matches[cursor].run()
      setOpen(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[18vh] p-4"
      onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div className="card rounded-2xl w-full max-w-md pop-in overflow-hidden bg-[#0b0b0b]!">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setCursor(0)
          }}
          onKeyDown={onInputKey}
          placeholder="Type a command…"
          className="w-full bg-transparent px-4 py-3.5 outline-none text-white placeholder-white/25 border-b border-white/10"
        />
        <ul className="max-h-72 overflow-y-auto p-1.5">
          {matches.length === 0 && (
            <li className="mono text-[10px] text-white/30 px-3 py-3">No matches</li>
          )}
          {matches.map((a, i) => (
            <li key={a.id}>
              <button
                onMouseEnter={() => setCursor(i)}
                onClick={() => {
                  a.run()
                  setOpen(false)
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                  i === cursor ? 'bg-white/10 text-white' : 'text-white/60'
                }`}
              >
                <span className="truncate">{a.label}</span>
                {a.hint && <span className="mono text-[9px] text-white/25 ml-3 shrink-0">{a.hint}</span>}
              </button>
            </li>
          ))}
        </ul>
        <p className="mono text-[9px] text-white/25 px-4 py-2 border-t border-white/10">
          ↑↓ navigate · ↵ run · esc close
        </p>
      </div>
    </div>
  )
}
