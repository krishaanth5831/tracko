import { MoneySack } from './MoneySack.jsx'

// Registry of swappable goal visualizations. Each component takes
// { progress: 0..1, size: tailwind size classes }. To add one: write a
// component here and add a row to GOAL_VIZZES — cards, focus view and the
// form picker all render from this registry.
export const GOAL_VIZZES = [
  { id: 'sack', label: 'Money sack' },
  { id: 'thermometer', label: 'Thermometer' },
  { id: 'jar', label: 'Jar' },
  { id: 'ring', label: 'Ring' },
]

// Tube meets the bulb circle (r=14, cy=104) at y≈91.9 where the walls are 7 from center.
const THERMO_PATH =
  'M 23 91.9 L 23 15 A 7 7 0 0 1 37 15 L 37 91.9 A 14 14 0 1 1 23 91.9 Z'

export function Thermometer({ progress, color = '#ef5350', size = 'w-32 h-32' }) {
  const p = Math.min(Math.max(progress, 0), 1)
  const bulbH = 28 // always-filled reservoir at the bottom
  const tubeH = 82
  const bottom = 118
  const fillH = p > 0 ? bulbH + tubeH * p : 0
  const fillY = bottom - fillH

  return (
    <svg viewBox="0 0 60 122" className={`${size} mx-auto`}>
      <defs>
        <clipPath id="thermoClip">
          <path d={THERMO_PATH} />
        </clipPath>
      </defs>

      <path d={THERMO_PATH} fill="rgba(255,255,255,0.04)" />

      <g clipPath="url(#thermoClip)">
        <rect className="sack-fill" x="0" y={fillY} width="60" height={fillH + 4} fill={color} />
      </g>

      {/* hairline ticks every 25% */}
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <line
          key={f}
          x1="40"
          x2="46"
          y1={bottom - (bulbH + tubeH * f)}
          y2={bottom - (bulbH + tubeH * f)}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1"
        />
      ))}

      <path d={THERMO_PATH} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
    </svg>
  )
}

const JAR_PATH =
  'M 34 30 C 30 34 28 40 28 48 L 28 104 C 28 111 33 116 40 116 L 80 116 C 87 116 92 111 92 104 L 92 48 C 92 40 90 34 86 30 Z'

export function Jar({ progress, color = '#5aa7f5', size = 'w-32 h-32' }) {
  const p = Math.min(Math.max(progress, 0), 1)
  const bodyTop = 34
  const bodyBottom = 116
  const fillH = (bodyBottom - bodyTop) * p
  const fillY = bodyBottom - fillH

  return (
    <svg viewBox="0 0 120 122" className={`${size} mx-auto`}>
      <defs>
        <clipPath id="jarClip">
          <path d={JAR_PATH} />
        </clipPath>
        <linearGradient id="jarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.55" />
        </linearGradient>
      </defs>

      <path d={JAR_PATH} fill="rgba(255,255,255,0.04)" />

      <g clipPath="url(#jarClip)">
        <rect className="sack-fill" x="0" y={fillY} width="120" height={fillH + 4} fill="url(#jarGrad)" />
        {p > 0.02 && <ellipse className="sack-fill" cx="60" cy={fillY} rx="31" ry="3" fill={color} />}
      </g>

      <path d={JAR_PATH} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />

      {/* lid pops when the jar is full */}
      <g className={`jar-lid ${p >= 1 ? 'popped' : ''}`}>
        <rect x="30" y="14" width="60" height="12" rx="4" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        <line x1="38" y1="26" x2="38" y2="14" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="82" y1="26" x2="82" y2="14" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      </g>
    </svg>
  )
}

export function Ring({ progress, size = 'w-32 h-32' }) {
  const p = Math.min(Math.max(progress, 0), 1)
  const r = 52
  const c = 2 * Math.PI * r

  return (
    <svg viewBox="0 0 120 120" className={`${size} mx-auto`}>
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
      <circle
        className="ring-progress"
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - p)}
        transform="rotate(-90 60 60)"
      />
      <text
        x="60"
        y="60"
        textAnchor="middle"
        dominantBaseline="central"
        fill="rgba(255,255,255,0.9)"
        fontSize="28"
        fontWeight="700"
        style={{ fontFeatureSettings: '"tnum"' }}
      >
        {Math.round(p * 100)}%
      </text>
    </svg>
  )
}

export const VIZ_COMPONENTS = {
  sack: MoneySack,
  thermometer: Thermometer,
  jar: Jar,
  ring: Ring,
}
