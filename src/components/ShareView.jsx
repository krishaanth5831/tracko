import { Modal, btnPrimary, btnGhost } from './ui.jsx'
import { useNow } from '../hooks/useNow.js'
import { MODE_COMPONENTS } from './events/countdownModes.jsx'
import { VIZ_COMPONENTS } from './goals/vizzes.jsx'
import { Logo } from './LogoPicker.jsx'
import { effectiveDate } from '../lib/countdown.js'

// Preview of a tracker someone shared via link, with a one-click import.
export function ShareView({ kind, item, onAdd, onDismiss }) {
  const now = useNow(1000)

  return (
    <Modal title="Shared with you" onClose={onDismiss}>
      <div className="flex flex-col items-center gap-5 py-2">
        <Logo image={item.image} emoji={item.emoji ?? (kind === 'goal' ? '💰' : '📅')} size="w-16 h-16" />
        <h3 className="text-2xl font-bold tracking-tight text-center">{item.name}</h3>

        {kind === 'event' ? (
          <SharedEvent item={item} now={now} />
        ) : (
          <SharedGoal item={item} />
        )}

        <div className="flex gap-3 mt-2">
          <button onClick={onAdd} className={btnPrimary}>
            Add to my Tracko
          </button>
          <button onClick={onDismiss} className={btnGhost}>
            Dismiss
          </button>
        </div>
      </div>
    </Modal>
  )
}

function SharedEvent({ item, now }) {
  const Mode = MODE_COMPONENTS[item.mode] ?? MODE_COMPONENTS.days
  const date = effectiveDate(item, now)
  return (
    <div className="flex flex-col items-center gap-2">
      <Mode date={date} now={now} />
      <p className="mono text-[10px] text-white/40">
        {new Date(date).toLocaleString(undefined, {
          dateStyle: 'full',
          timeStyle: date.includes('T') ? 'short' : undefined,
        })}
      </p>
    </div>
  )
}

function SharedGoal({ item }) {
  const total = (item.contributions ?? []).reduce((s, c) => s + c.amount, 0)
  const progress = item.target > 0 ? total / item.target : 0
  const Viz = VIZ_COMPONENTS[item.viz] ?? VIZ_COMPONENTS.sack
  return (
    <div className="flex flex-col items-center gap-2">
      <Viz progress={progress} size="w-36 h-36" />
      <p className="mono text-[10px] text-white/40">
        {item.currency ?? '$'}
        {total.toLocaleString()} / {item.currency ?? '$'}
        {item.target.toLocaleString()} · {Math.round(Math.min(progress, 1) * 100)}%
      </p>
    </div>
  )
}
