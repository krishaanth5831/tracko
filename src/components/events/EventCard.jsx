import { useNow } from '../../hooks/useNow.js'
import { MODE_COMPONENTS } from './countdownModes.jsx'
import { Logo } from '../LogoPicker.jsx'

export function EventCard({ event, onEdit, onDelete, onOpen }) {
  const needsSeconds = event.mode === 'live' || event.mode === 'full'
  const now = useNow(needsSeconds ? 1000 : 30000)
  const Mode = MODE_COMPONENTS[event.mode] ?? MODE_COMPONENTS.days
  const isPast = new Date(event.date) < now

  return (
    <div
      onClick={() => onOpen(event.id)}
      className="card rounded-2xl p-5 flex flex-col gap-5 pop-in relative group cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <Logo image={event.image} emoji={event.emoji} />
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{event.name}</h3>
          <p className="mono text-[10px] text-white/35 mt-0.5">
            {new Date(event.date).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: event.date.includes('T') ? 'short' : undefined,
            })}
            {isPast && ' · past'}
          </p>
        </div>
      </div>

      <div className="py-1">
        <Mode date={event.date} now={now} />
      </div>

      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit(event)
          }}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-xs text-white/60"
          title="Edit"
        >
          ✎
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(event.id)
          }}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-xs text-white/60"
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
