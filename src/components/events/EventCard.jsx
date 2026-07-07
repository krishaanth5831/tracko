import { useNow } from '../../hooks/useNow.js'
import { useT0 } from '../../hooks/useT0.js'
import { useTilt } from '../../hooks/useTilt.js'
import { effectiveDate } from '../../lib/countdown.js'
import { MODE_COMPONENTS } from './countdownModes.jsx'
import { Logo } from '../LogoPicker.jsx'

export function EventCard({ event, onEdit, onDelete, onOpen, onShare, dragProps }) {
  const needsSeconds = event.mode === 'live' || event.mode === 'full'
  const now = useNow(needsSeconds ? 1000 : 30000)
  const Mode = MODE_COMPONENTS[event.mode] ?? MODE_COMPONENTS.days
  const tilt = useTilt()

  const date = effectiveDate(event, now)
  const repeats = event.repeat && event.repeat !== 'none'
  const isPast = !repeats && new Date(date) < now
  const flash = useT0(new Date(date.includes('T') ? date : date + 'T00:00').getTime(), now)

  return (
    <div
      onClick={() => onOpen(event.id)}
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className={`card tilt-card rounded-2xl p-5 flex flex-col gap-5 pop-in relative group cursor-pointer ${
        flash ? 't0-flash' : ''
      }`}
      {...dragProps}
    >
      <div className="flex items-center gap-3">
        <div className="tilt-deep shrink-0">
          <Logo image={event.image} emoji={event.emoji} />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold truncate">
            {event.name}
            {isPast && (
              <span className="mono text-[8px] border border-white/30 rounded px-1.5 py-0.5 ml-2 align-middle text-white/70">
                Arrived
              </span>
            )}
          </h3>
          <p className="mono text-[10px] text-white/35 mt-0.5">
            {new Date(date).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: date.includes('T') ? 'short' : undefined,
            })}
            {repeats && ` · ↻ ${event.repeat}`}
            {isPast && ' · past'}
          </p>
        </div>
      </div>

      <div className="py-1">
        <Mode date={date} now={now} />
      </div>

      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onShare && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onShare(event, 'event')
            }}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-xs text-white/60"
            title="Copy share link"
          >
            ⤴
          </button>
        )}
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
