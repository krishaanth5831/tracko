const SACK_PATH =
  'M 60 38 C 52 38 46 36 46 32 C 46 29 49 27 52 26 C 47 22 44 17 44 12 C 44 6 51 2 60 2 C 69 2 76 6 76 12 C 76 17 73 22 68 26 C 71 27 74 29 74 32 C 74 36 68 38 60 38 C 84 46 100 64 100 88 C 100 110 82 118 60 118 C 38 118 20 110 20 88 C 20 64 36 46 60 38 Z'

// progress: 0..1 — monochrome sack outline, gold fill rising bottom-up
export function MoneySack({ progress, color = '#f5b640' }) {
  const p = Math.min(Math.max(progress, 0), 1)
  const bodyTop = 38
  const bodyBottom = 118
  const fillH = (bodyBottom - bodyTop) * p
  const fillY = bodyBottom - fillH

  return (
    <svg viewBox="0 0 120 122" className="w-32 h-32 mx-auto">
      <defs>
        <clipPath id="sackClip">
          <path d={SACK_PATH} />
        </clipPath>
        <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={color} stopOpacity="0.65" />
        </linearGradient>
      </defs>

      <path d={SACK_PATH} fill="rgba(255,255,255,0.04)" />

      <g clipPath="url(#sackClip)">
        <rect className="sack-fill" x="0" y={fillY} width="120" height={fillH + 4} fill="url(#fillGrad)" />
        {p > 0.02 && (
          <ellipse className="sack-fill" cx="60" cy={fillY} rx="42" ry="3.5" fill={color} />
        )}
      </g>

      <path d={SACK_PATH} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
    </svg>
  )
}
