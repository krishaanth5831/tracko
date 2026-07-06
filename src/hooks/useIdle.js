import { useEffect, useRef, useState } from 'react'

const WAKE_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel']

// True after `ms` of no user input; any input wakes instantly. `startIdle`
// begins idle right away (the ?zen flag). Returns [idle, wokeAtRef] —
// wokeAtRef.current holds the timestamp of the last idle→awake transition so
// callers can swallow the very input that woke the screen.
export function useIdle(ms = 5000, startIdle = false) {
  const [idle, setIdle] = useState(startIdle)
  const wokeAt = useRef(0)

  useEffect(() => {
    let timer
    const arm = () => {
      clearTimeout(timer)
      timer = setTimeout(() => setIdle(true), ms)
    }
    const wake = () => {
      setIdle((was) => {
        if (was) wokeAt.current = Date.now()
        return false
      })
      arm()
    }
    if (!startIdle) arm()
    WAKE_EVENTS.forEach((ev) => window.addEventListener(ev, wake, { passive: true }))
    return () => {
      clearTimeout(timer)
      WAKE_EVENTS.forEach((ev) => window.removeEventListener(ev, wake))
    }
  }, [ms, startIdle])

  return [idle, wokeAt]
}
