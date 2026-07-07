import { useEffect, useRef } from 'react'
import { effectiveDate } from '../lib/countdown.js'
import { t0Confetti } from '../lib/celebrate.js'
import { playChime, notify } from '../lib/sound.js'

const toMs = (iso) => new Date(iso.includes('T') ? iso : iso + 'T00:00').getTime()

// App-level T-0 watcher: fires confetti (and, when alerts are on, a chime +
// system notification) the second any event hits zero — even if its card
// isn't currently rendered. Cards handle their own visual flash.
export function useT0Watcher(events, alerts) {
  const eventsRef = useRef(events)
  const alertsRef = useRef(alerts)
  eventsRef.current = events
  alertsRef.current = alerts

  useEffect(() => {
    let last = Date.now()
    const iv = setInterval(() => {
      const now = Date.now()
      for (const ev of eventsRef.current) {
        // the occurrence that was upcoming as of the previous tick
        const target = toMs(effectiveDate(ev, last))
        if (target > last && target <= now) {
          t0Confetti()
          if (alertsRef.current) {
            playChime()
            notify(ev.name, 'T-0 — it’s here.')
          }
        }
      }
      last = now
    }, 1000)
    return () => clearInterval(iv)
  }, [])
}
