import { useRef } from 'react'
import { PIXELS, COLS, ROWS } from './PixelLogo.jsx'

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// The Tracko mark extruded into 3D — every pixel becomes a CSS-3D cube on a
// slowly turning rotor. Click to blow it apart and watch it reassemble.
// No 3D runtime needed: it's the same PIXELS grid as the flat logo.
export function PixelLogo3D({ px = 18, gap = 4, className = '' }) {
  const cubeRefs = useRef([])
  const exploding = useRef(false)

  const cell = px + gap
  const width = COLS * cell - gap
  const height = ROWS * cell - gap
  const depth = px

  function explode() {
    if (exploding.current || reducedMotion()) return
    exploding.current = true
    cubeRefs.current.forEach((el) => {
      if (!el) return
      const a = Math.random() * Math.PI * 2
      const r = cell * (2.5 + Math.random() * 4)
      el.style.transform = `${el.dataset.base} translate3d(${Math.cos(a) * r}px, ${Math.sin(a) * r}px, ${(Math.random() - 0.2) * 260}px) rotateX(${(Math.random() - 0.5) * 360}deg) rotateY(${(Math.random() - 0.5) * 360}deg)`
    })
    setTimeout(() => {
      cubeRefs.current.forEach((el) => el && (el.style.transform = el.dataset.base))
      setTimeout(() => (exploding.current = false), 900)
    }, 550)
  }

  const faces = [
    { name: 'front', t: `translateZ(${depth / 2}px)`, bg: '#ffffff' },
    { name: 'back', t: `rotateY(180deg) translateZ(${depth / 2}px)`, bg: '#5a5a5a' },
    { name: 'right', t: `rotateY(90deg) translateZ(${px / 2}px)`, bg: '#9a9a9a' },
    { name: 'left', t: `rotateY(-90deg) translateZ(${px / 2}px)`, bg: '#b8b8b8' },
    { name: 'top', t: `rotateX(90deg) translateZ(${px / 2}px)`, bg: '#d8d8d8' },
    { name: 'bottom', t: `rotateX(-90deg) translateZ(${px / 2}px)`, bg: '#787878' },
  ]

  return (
    <div
      className={`p3d-wrap cursor-pointer select-none ${className}`}
      onClick={explode}
      title="Click me"
      aria-hidden="true"
    >
      <div className="p3d-tilt" style={{ width, height }}>
        <div className="p3d-rotor" style={{ width, height }}>
          {PIXELS.map(({ c, r }, i) => {
            const base = `translate3d(${c * cell - width / 2 + px / 2}px, ${r * cell - height / 2 + px / 2}px, 0)`
            return (
              <div
                key={`${c}-${r}`}
                ref={(el) => (cubeRefs.current[i] = el)}
                data-base={base}
                className="p3d-cube"
                style={{ width: px, height: px, transform: base }}
              >
                {faces.map((f) => (
                  <div key={f.name} className="p3d-face" style={{ transform: f.t, background: f.bg }} />
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
