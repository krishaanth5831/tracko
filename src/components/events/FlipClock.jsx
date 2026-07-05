import { useEffect, useRef, useState } from 'react'

// One Fliqlo-style split-flap tile showing a 2-digit value.
// When `value` changes, the old top half flaps down over the new value.
function FlipTile({ value, label, size = 'md' }) {
  const [shown, setShown] = useState(value)
  const timer = useRef(null)

  useEffect(() => {
    if (value === shown) return
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setShown(value), 560)
    return () => clearTimeout(timer.current)
  }, [value, shown])

  const flipping = value !== shown
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

export function FlipClock({ units, size = 'md' }) {
  return (
    <div className={`flex justify-center ${size === 'xl' ? 'gap-4' : 'gap-2'}`}>
      {units.map((u) => (
        <FlipTile key={u.label} value={String(u.value).padStart(2, '0')} label={u.label} size={size} />
      ))}
    </div>
  )
}
