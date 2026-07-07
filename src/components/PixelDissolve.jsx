import { useEffect, useMemo, useRef, useState } from 'react'

const COLS = 16
const ROWS = 10

// Brief full-screen pixel dissolve, played between tab switches — a grid of
// black cells that flash in and out with random delays.
export function PixelDissolve({ trigger }) {
  const [playing, setPlaying] = useState(false)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setPlaying(true)
    const t = setTimeout(() => setPlaying(false), 650)
    return () => clearTimeout(t)
  }, [trigger])

  const delays = useMemo(
    () => Array.from({ length: COLS * ROWS }, () => Math.random() * 0.18),
    [playing] // eslint-disable-line react-hooks/exhaustive-deps
  )

  if (!playing) return null

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none grid"
      style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
      aria-hidden="true"
    >
      {delays.map((d, i) => (
        <div key={i} className="pxd-cell" style={{ animationDelay: `${d}s` }} />
      ))}
    </div>
  )
}
