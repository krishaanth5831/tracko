// T-0 chime, synthesized with WebAudio — no audio asset needed.
let ctx

export function playChime() {
  try {
    ctx ??= new (window.AudioContext ?? window.webkitAudioContext)()
    if (ctx.state === 'suspended') ctx.resume()
    const t0 = ctx.currentTime
    // two rising sine notes, A5 → D6
    for (const [freq, dt] of [
      [880, 0],
      [1174.66, 0.18],
    ]) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, t0 + dt)
      gain.gain.exponentialRampToValueAtTime(0.22, t0 + dt + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dt + 0.6)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t0 + dt)
      osc.stop(t0 + dt + 0.7)
    }
  } catch {
    /* audio unavailable */
  }
}

export function canNotify() {
  return typeof Notification !== 'undefined'
}

export function requestNotifyPermission() {
  if (canNotify() && Notification.permission === 'default') Notification.requestPermission()
}

export function notify(title, body) {
  if (canNotify() && Notification.permission === 'granted') {
    try {
      new Notification(title, { body })
    } catch {
      /* some platforms only allow notifications from service workers */
    }
  }
}
