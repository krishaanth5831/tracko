import { useEffect, useRef, useState } from 'react'

// True for ~700ms whenever `count` increases — drives the liquid-surface
// wobble on goal vizzes when a contribution lands.
export function useRipple(count) {
  const prev = useRef(count)
  const [rippling, setRippling] = useState(false)

  useEffect(() => {
    if (count > prev.current) {
      setRippling(true)
      const t = setTimeout(() => setRippling(false), 700)
      prev.current = count
      return () => clearTimeout(t)
    }
    prev.current = count
  }, [count])

  return rippling
}
