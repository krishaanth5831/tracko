import { useNow } from '../../hooks/useNow.js'
import { MODE_COMPONENTS } from './countdownModes.jsx'

export function EventCard({ event, onEdit, onDelete }) {
  const needsSeconds = event.mode === 'live' || event.mode === 'full'
  const now = useNow(needsSeconds ? 1000 : 30000)
  const Mode = MODE_COMPONENTS[event.mode] ?? MODE_COMPONENTS.days
  const isPast = new Date(event.date) < now

  return (
    <div
      className="card-glass rounded-2xl p-5 flex flex-col gap-4 pop-in relative group"
      style={{ boxShadow: `0 0 40px -12px ${event.color}55` }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: `${event.color}22`, border: `1px solid ${event.color}44` }}
        >
          {event.emoji}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{event.name}</h3>
          <p className="text-xs text-white/50">
            {new Date(event.date).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: event.date.includes('T') ? 'short' : undefined,
            })}
            {isPast && ' · past'}
          </p>
        </div>
      </div>

      <div className="py-2" style={{ color: event.color }}>
        <Mode date={event.date} now={now} />
      </div>

      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(event)}
          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-xs"
          title="Edit"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(event.id)}
          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-red-500/40 text-xs"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
