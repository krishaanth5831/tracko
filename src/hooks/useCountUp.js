import { useEffect, useRef, useState } from 'react'

// Tween a displayed number toward `value` (dot-matrix style tick-up) instead
// of jumping. Returns the animated value, rounded to integers.
export function useCountUp(value, duration = 700) {
  const [shown, setShown] = useState(value)
  const raf = useRef(0)
  const fromRef = useRef(value)

  useEffect(() => {
    if (value === fromRef.current) return
    const from = fromRef.current
    const start = performance.now()
    cancelAnimationFrame(raf.current)
    const step = (t) => {
      const k = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - k, 3)
      setShown(Math.round(from + (value - from) * eased))
      if (k < 1) raf.current = requestAnimationFrame(step)
      else fromRef.current = value
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [value, duration])

  return shown
}
