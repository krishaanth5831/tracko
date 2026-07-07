import { useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

// Split-flap display board text: characters cycle rapidly and lock in one by
// one, left to right. Re-runs when `text` changes.
export function SplitFlap({ text, lockMs = 60 }) {
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [locked, setLocked] = useState(reduced ? Infinity : 0)
  const [, setTick] = useState(0)
  const iv = useRef(null)

  useEffect(() => {
    if (reduced) return
    setLocked(0)
    const start = performance.now()
    iv.current = setInterval(() => {
      const n = Math.floor((performance.now() - start) / lockMs)
      setLocked(n)
      setTick((t) => t + 1) // re-randomize the still-spinning chars
      if (n >= text.length) clearInterval(iv.current)
    }, 40)
    return () => clearInterval(iv.current)
  }, [text, lockMs, reduced])

  return (
    <span aria-label={text}>
      {[...text].map((ch, i) => (
        <span key={i} aria-hidden="true">
          {i < locked || ch === ' ' ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]}
        </span>
      ))}
    </span>
  )
}
