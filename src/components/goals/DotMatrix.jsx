// Caveman-style dot matrix progress: filled dots green, rest faint
export function DotMatrix({ progress, total = 40, cols = 20 }) {
  const filled = Math.round(Math.min(progress, 1) * total)
  return (
    <div className="grid gap-1 w-full" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="dot-cell aspect-square rounded-full"
          style={{ backgroundColor: i < filled ? '#4ade80' : 'rgba(255,255,255,0.08)' }}
        />
      ))}
    </div>
  )
}
