import { useEffect, useRef, useState } from 'react'

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// One Fliqlo-style split-flap tile showing a 2-digit value.
// When `value` changes, the old top half flaps down over the new value.
// `instant` skips the flap (used while the boot cascade spins the reels).
function FlipTile({ value, label, size = 'md', instant }) {
  const [shown, setShown] = useState(value)
  const timer = useRef(null)

  useEffect(() => {
    if (value === shown) return
    if (instant) {
      setShown(value)
      return
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setShown(value), 560)
    return () => clearTimeout(timer.current)
  }, [value, shown, instant])

  const flipping = !instant && value !== shown
  const dims = {
    md: { tile: 'w-14 h-16 text-3xl', label: 'text-[9px]' },
    lg: { tile: 'w-20 h-24 text-5xl', label: 'text-[10px]' },
    xl: { tile: 'w-28 h-36 text-7xl sm:w-36 sm:h-44 sm:text-8xl', label: 'text-xs' },
  }[size]

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`flip-tile ${dims.tile}`}>
        <div className="flip-half top">
          <span>{value}</span>
        </div>
        <div className="flip-half bottom">
          <span>{shown}</span>
        </div>
        {flipping && (
          <>
            <div className="flip-half top flip-flap front">
              <span>{shown}</span>
            </div>
            <div className="flip-half bottom flip-flap back">
              <span>{value}</span>
            </div>
          </>
        )}
      </div>
      {label && <span className={`mono text-white/35 ${dims.label}`}>{label}</span>}
    </div>
  )
}

// Departure-board boot: on mount every tile spins through random digits,
// settling left to right onto the real values.
function useBootCascade(count) {
  const [elapsed, setElapsed] = useState(() => (reducedMotion() ? Infinity : 0))
  const doneAt = 380 + (count - 1) * 190

  useEffect(() => {
    if (elapsed > doneAt) return
    const t = setTimeout(() => setElapsed((e) => e + 80), 80)
    return () => clearTimeout(t)
  }, [elapsed, doneAt])

  return (i) => elapsed > 380 + i * 190 // tile i settled?
}

export function FlipClock({ units, size = 'md' }) {
  const settled = useBootCascade(units.length)
  return (
    <div className={`flex justify-center ${size === 'xl' ? 'gap-4' : 'gap-2'}`}>
      {units.map((u, i) => {
        const spinning = !settled(i)
        const value = spinning
          ? String(Math.floor(Math.random() * 100)).padStart(2, '0')
          : String(u.value).padStart(2, '0')
        return <FlipTile key={u.label} value={value} label={u.label} size={size} instant={spinning} />
      })}
    </div>
  )
}
