import { useState } from 'react'
import { autoEmoji } from '../../lib/autoLogo.js'
import { COUNTDOWN_MODES } from '../../lib/countdown.js'
import { uid } from '../../state/store.jsx'
import { Modal, inputCls, btnPrimary } from '../ui.jsx'
import { LogoPicker } from '../LogoPicker.jsx'

export function EventForm({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [date, setDate] = useState(initial?.date?.slice(0, 10) ?? '')
  const [time, setTime] = useState(initial?.date?.includes('T') ? initial.date.slice(11, 16) : '')
  const [mode, setMode] = useState(initial?.mode ?? 'days')
  const [image, setImage] = useState(initial?.image ?? null)

  const emoji = autoEmoji(name || 'event')

  function submit(e) {
    e.preventDefault()
    if (!name.trim() || !date) return
    onSave({
      id: initial?.id ?? uid(),
      name: name.trim(),
      date: time ? `${date}T${time}` : date,
      emoji,
      image,
      mode,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    })
  }

  return (
    <Modal title={initial ? 'Edit event' : 'New event'} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-5">
        <input
          autoFocus
          className={inputCls + ' text-lg'}
          placeholder="Event name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex gap-3">
          <label className="flex-1 mono text-[10px] text-white/40">
            Date
            <input type="date" className={inputCls + ' mt-1.5 font-sans normal-case tracking-normal'} value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="flex-1 mono text-[10px] text-white/40">
            Time · optional
            <input type="time" className={inputCls + ' mt-1.5 font-sans normal-case tracking-normal'} value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
        </div>

        <div>
          <p className="mono text-[10px] text-white/40 mb-2">Countdown style</p>
          <div className="grid grid-cols-2 gap-2">
            {COUNTDOWN_MODES.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`rounded-lg px-3 py-2 text-sm border transition-colors ${
                  mode === m.id
                    ? 'border-white bg-white/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/30'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <LogoPicker query={name} value={image} onChange={setImage} fallbackEmoji={emoji} />

        <button type="submit" className={btnPrimary} disabled={!name.trim() || !date}>
          {initial ? 'Save changes' : 'Add event'}
        </button>
      </form>
    </Modal>
  )
}
