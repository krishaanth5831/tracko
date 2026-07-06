import { useEffect, useMemo, useRef } from 'react'

// The Tracko mark: two mirrored pixel wings (▶◀), one array entry per row.
// Column indices are for the left wing; the right wing is mirrored across COLS.
const LEFT_WING = [
  [1],
  [1, 2],
  [1, 2, 3],
  [0, 1, 2, 3],
  [0, 1, 2, 3, 4],
  [0, 1, 2, 3],
  [1, 2, 3],
  [1, 2],
  [1],
]
export const COLS = 11
export const ROWS = LEFT_WING.length
export const PIXELS = LEFT_WING.flatMap((cols, r) =>
  cols.flatMap((c) => [
    { c, r },
    { c: COLS - 1 - c, r },
  ])
)

const CENTER = { c: (COLS - 1) / 2, r: (ROWS - 1) / 2 }
const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Interactive pixel-grid logo. Pixels assemble on mount, repel the cursor,
 * scatter + re-form on click, and idle-flicker like a dot matrix.
 * `px` = pixel square size, `gap` = spacing between squares (both CSS px).
 */
export function PixelLogo({ px = 3, gap = 1, className = '' }) {
  const gridRef = useRef(null)
  const pixelRefs = useRef([])
  const scattering = useRef(false)
  const raf = useRef(0)

  const cell = px + gap
  const width = COLS * cell - gap
  const height = ROWS * cell - gap

  // Random per-mount delays so the assemble animation shimmers differently each load.
  const delays = useMemo(
    () =>
      PIXELS.map(({ c, r }) => {
        const dist = Math.hypot(c - CENTER.c, r - CENTER.r)
        return dist * 45 + Math.random() * 90
      }),
    []
  )

  function eachPixel(fn) {
    PIXELS.forEach((p, i) => {
      const el = pixelRefs.current[i]
      if (el) fn(el, p, i)
    })
  }

  function onMouseMove(e) {
    if (scattering.current) return
    const rect = gridRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      const radius = cell * 3.5
      eachPixel((el, { c, r }) => {
        const dx = c * cell + px / 2 - mx
        const dy = r * cell + px / 2 - my
        const dist = Math.hypot(dx, dy) || 1
        if (dist < radius) {
          const f = 1 - dist / radius
          el.style.transform = `translate(${(dx / dist) * f * px * 1.6}px, ${(dy / dist) * f * px * 1.6}px) scale(${1 + f * 0.5})`
        } else {
          el.style.transform = ''
        }
      })
    })
  }

  function onMouseLeave() {
    cancelAnimationFrame(raf.current)
    if (!scattering.current) eachPixel((el) => (el.style.transform = ''))
  }

  function scatter() {
    if (scattering.current || reducedMotion()) return
    scattering.current = true
    cancelAnimationFrame(raf.current)
    eachPixel((el) => {
      const angle = Math.random() * Math.PI * 2
      const throw_ = cell * (3 + Math.random() * 5)
      el.style.transition = 'transform 0.3s cubic-bezier(0.3, 0, 0.6, 1), opacity 0.3s ease'
      el.style.transform = `translate(${Math.cos(angle) * throw_}px, ${Math.sin(angle) * throw_}px) rotate(${(Math.random() - 0.5) * 540}deg) scale(0.3)`
      el.style.opacity = '0.5'
    })
    setTimeout(() => {
      eachPixel((el) => {
        el.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease'
        el.style.transform = ''
        el.style.opacity = ''
      })
      setTimeout(() => {
        eachPixel((el) => (el.style.transition = ''))
        scattering.current = false
      }, 650)
    }, 320)
  }

  // Idle flicker: every couple of seconds a random pixel blinks, dot-matrix style.
  useEffect(() => {
    if (reducedMotion()) return
    const interval = setInterval(() => {
      if (scattering.current) return
      const el = pixelRefs.current[Math.floor(Math.random() * PIXELS.length)]
      if (!el) return
      el.style.opacity = '0.25'
      setTimeout(() => (el.style.opacity = ''), 180)
    }, 2200)
    return () => {
      clearInterval(interval)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <span
      ref={gridRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={scatter}
      className={`plogo ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    >
      {PIXELS.map(({ c, r }, i) => (
        <span
          key={`${c}-${r}`}
          ref={(el) => (pixelRefs.current[i] = el)}
          className="plogo-px"
          style={{
            left: c * cell,
            top: r * cell,
            width: px,
            height: px,
            animationDelay: `${delays[i]}ms`,
          }}
        />
      ))}
    </span>
  )
}
