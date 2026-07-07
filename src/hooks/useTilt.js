import { useRef } from 'react'

// Subtle hover parallax: the card tilts 1–2° toward the cursor. Returns
// props to spread on the card element; give children that should float
// (like the logo) the `tilt-deep` class.
export function useTilt(max = 2) {
  const ref = useRef(null)

  function onMouseMove(e) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg)`
  }

  function onMouseLeave() {
    if (ref.current) ref.current.style.transform = ''
  }

  return { ref, onMouseMove, onMouseLeave, className: 'tilt-card' }
}
