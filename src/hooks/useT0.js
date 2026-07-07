import { useEffect, useRef, useState } from 'react'

// True for ~2.2s right after `now` crosses the countdown target — including
// repeating events, whose target rolls forward the moment it's reached
// (we compare against the *previous* tick's target).
export function useT0(targetMs, now) {
  const prevNow = useRef(now)
  const prevTarget = useRef(targetMs)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    const crossed = prevNow.current < prevTarget.current && now >= prevTarget.current
    prevNow.current = now
    prevTarget.current = targetMs
    if (crossed) {
      setFlash(true)
      const t = setTimeout(() => setFlash(false), 2200)
      return () => clearTimeout(t)
    }
  }, [now, targetMs])

  return flash
}
