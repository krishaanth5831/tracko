import confetti from 'canvas-confetti'

// Confetti policy: quiet monochrome puffs at the quarter milestones,
// full gold at 100%.
export function goalConfetti(prev, progress, origin = { y: 0.5 }) {
  if (prev < 1 && progress >= 1) {
    confetti({ particleCount: 160, spread: 90, origin, colors: ['#f5b640', '#ffd76a', '#ffffff'] })
    return
  }
  for (const m of [0.25, 0.5, 0.75]) {
    if (prev < m && progress >= m) {
      confetti({ particleCount: 36, spread: 55, origin, colors: ['#ffffff', '#9ca3af'], scalar: 0.8 })
      return
    }
  }
}

export function t0Confetti() {
  confetti({ particleCount: 180, spread: 100, origin: { y: 0.4 }, colors: ['#ffffff', '#f5b640', '#9ca3af'] })
}
