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
  { id: 'battery', label: 'Battery' },
  { id: 'pixels', label: 'Pixel grid' },
  { id: 'skyline', label: 'Skyline' },
  { id: 'orbit', label: 'Orbit' },
  { id: 'vault', label: 'Vault' },
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

export function Battery({ progress, color = '#4ade80', size = 'w-32 h-32' }) {
  const p = Math.min(Math.max(progress, 0), 1)
  const segs = 5
  const segW = 16

  return (
    <svg viewBox="0 0 120 64" className={`${size} mx-auto`}>
      <rect x="8" y="16" width="96" height="32" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
      <rect x="106" y="26" width="7" height="12" rx="2" fill="rgba(255,255,255,0.3)" />
      {Array.from({ length: segs }, (_, i) => {
        const fullness = Math.min(Math.max(p * segs - i, 0), 1)
        if (fullness <= 0) return null
        const charging = p < 1 && fullness > 0 && p * segs - i <= 1
        return (
          <rect
            key={i}
            className={charging ? 'bat-pulse' : undefined}
            x={13 + i * (segW + 2)}
            y="21"
            width={segW * fullness}
            height="22"
            rx="2"
            fill={color}
          />
        )
      })}
    </svg>
  )
}

// Progress as a field of tiny squares filling in one by one, bottom-up —
// same language as the pixel logo.
export function PixelGrid({ progress, size = 'w-32 h-32' }) {
  const p = Math.min(Math.max(progress, 0), 1)
  const cols = 12
  const rows = 8
  const filled = Math.round(p * cols * rows)

  return (
    <svg viewBox="0 0 120 80" className={`${size} mx-auto`}>
      {Array.from({ length: cols * rows }, (_, i) => {
        const row = Math.floor(i / cols) // 0 = bottom row
        const col = i % cols
        return (
          <rect
            key={i}
            className="px-cell"
            x={col * 10 + 1}
            y={80 - (row + 1) * 10 + 1}
            width="8"
            height="8"
            fill={i < filled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.07)'}
          />
        )
      })}
    </svg>
  )
}

export function Skyline({ progress, size = 'w-32 h-32' }) {
  const p = Math.min(Math.max(progress, 0), 1)
  const floors = 10
  const floorH = 10
  const ground = 116
  const builtFull = Math.floor(p * floors)
  const partial = p * floors - builtFull
  const topY = ground - p * floors * floorH

  return (
    <svg viewBox="0 0 120 122" className={`${size} mx-auto`}>
      <line x1="18" y1={ground + 0.5} x2="102" y2={ground + 0.5} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

      {/* built floors, with lit windows */}
      {Array.from({ length: builtFull }, (_, i) => {
        const y = ground - (i + 1) * floorH
        return (
          <g key={i}>
            <rect x="38" y={y + 0.5} width="44" height={floorH - 1} fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
            {[48, 58.5, 69].map((wx) => (
              <rect key={wx} x={wx} y={y + 3} width="4" height="4" fill="rgba(255,255,255,0.6)" />
            ))}
          </g>
        )
      })}

      {/* current floor rising */}
      {partial > 0.02 && (
        <rect
          className="sack-fill"
          x="38"
          y={ground - builtFull * floorH - partial * floorH}
          width="44"
          height={partial * floorH}
          fill="rgba(255,255,255,0.09)"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1"
        />
      )}

      {/* scaffolding: dashed silhouette of what's left to build */}
      {p < 1 && (
        <rect
          x="38"
          y={ground - floors * floorH}
          width="44"
          height={floors * floorH - p * floors * floorH}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
      )}

      {/* crane while building, antenna when topped out */}
      {p < 1 && p > 0.02 ? (
        <g stroke="rgba(255,255,255,0.35)" strokeWidth="1">
          <line x1="90" y1={ground} x2="90" y2={topY - 14} />
          <line x1="90" y1={topY - 14} x2="66" y2={topY - 14} />
          <line x1="70" y1={topY - 14} x2="70" y2={topY - 6} />
        </g>
      ) : p >= 1 ? (
        <g stroke="rgba(255,255,255,0.6)" strokeWidth="1">
          <line x1="60" y1={ground - floors * floorH} x2="60" y2={ground - floors * floorH - 9} />
          <circle cx="60" cy={ground - floors * floorH - 11} r="1.6" fill="#f5b640" stroke="none" />
        </g>
      ) : null}
    </svg>
  )
}

// One orbit per 10% — the dot laps the ring, trail behind it, lap count in
// the middle. Cumulative rotation keeps the motion always moving forward.
export function Orbit({ progress, size = 'w-32 h-32' }) {
  const p = Math.min(Math.max(progress, 0), 1)
  const laps = Math.floor(p * 10)
  const angle = p * 10 * 360

  return (
    <svg viewBox="0 0 120 120" className={`${size} mx-auto`}>
      <circle cx="60" cy="60" r="44" fill="none" stroke={p >= 1 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.12)'} strokeWidth="2" />
      <g className="orbit-rotor" style={{ transform: `rotate(${angle}deg)`, transformOrigin: '60px 60px' }}>
        <circle cx="60" cy="16" r="4.5" fill="#fff" />
        <circle cx="60" cy="16" r="3" fill="rgba(255,255,255,0.45)" transform="rotate(-13 60 60)" />
        <circle cx="60" cy="16" r="2.4" fill="rgba(255,255,255,0.22)" transform="rotate(-26 60 60)" />
        <circle cx="60" cy="16" r="1.8" fill="rgba(255,255,255,0.1)" transform="rotate(-39 60 60)" />
      </g>
      <text x="60" y="56" textAnchor="middle" dominantBaseline="central" fill="rgba(255,255,255,0.9)" fontSize="24" fontWeight="700" style={{ fontFeatureSettings: '"tnum"' }}>
        {laps}/10
      </text>
      <text x="60" y="74" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="8" letterSpacing="2" fontFamily="var(--mono)">
        LAPS
      </text>
    </svg>
  )
}

export function Vault({ progress, color = '#f5b640', size = 'w-32 h-32' }) {
  const p = Math.min(Math.max(progress, 0), 1)
  const dialC = 2 * Math.PI * 22
  const coins = Math.ceil(p * 8)

  return (
    <svg viewBox="0 0 120 122" className={`${size} mx-auto`}>
      {/* body + interior (revealed when the door opens) */}
      <rect x="14" y="10" width="92" height="100" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
      <g>
        {Array.from({ length: coins }, (_, i) => (
          <ellipse key={i} cx="60" cy={98 - i * 8} rx="19" ry="4.5" fill={color} stroke="rgba(0,0,0,0.5)" strokeWidth="1" opacity={0.9} />
        ))}
      </g>

      {/* door: hinged on the left, swings open at 100% */}
      <g className={`vault-door ${p >= 1 ? 'open' : ''}`}>
        <rect x="22" y="18" width="76" height="84" rx="4" fill="#0c0c0c" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        {/* progress arc around the dial */}
        <circle
          className="ring-progress"
          cx="60"
          cy="60"
          r="22"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={dialC}
          strokeDashoffset={dialC * (1 - p)}
          transform="rotate(-90 60 60)"
        />
        <circle cx="60" cy="60" r="15" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        {Array.from({ length: 8 }, (_, i) => (
          <line
            key={i}
            x1="60"
            y1="47"
            x2="60"
            y2="50"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
            transform={`rotate(${i * 45} 60 60)`}
          />
        ))}
        {/* dial spins with progress */}
        <line
          className="orbit-rotor"
          x1="60"
          y1="60"
          x2="60"
          y2="49"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transform: `rotate(${p * 270}deg)`, transformOrigin: '60px 60px' }}
        />
        {/* handle */}
        <line x1="88" y1="54" x2="88" y2="66" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export const VIZ_COMPONENTS = {
  sack: MoneySack,
  thermometer: Thermometer,
  jar: Jar,
  ring: Ring,
  battery: Battery,
  pixels: PixelGrid,
  skyline: Skyline,
  orbit: Orbit,
  vault: Vault,
}
