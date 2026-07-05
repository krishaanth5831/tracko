import { useState } from 'react'
import { autoEmoji, autoColor } from '../../lib/autoLogo.js'
import { COUNTDOWN_MODES } from '../../lib/countdown.js'
import { uid } from '../../state/store.jsx'
import { Modal, inputCls, btnPrimary } from '../ui.jsx'

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#06b6d4', '#f97316']

export function EventForm({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [date, setDate] = useState(initial?.date?.slice(0, 10) ?? '')
  const [time, setTime] = useState(initial?.date?.includes('T') ? initial.date.slice(11, 16) : '')
  const [mode, setMode] = useState(initial?.mode ?? 'days')
  const [emojiOverride, setEmojiOverride] = useState(initial?.autoLogo === false ? initial.emoji : '')
  const [color, setColor] = useState(initial?.color ?? '')

  const previewEmoji = emojiOverride || autoEmoji(name || 'event')
  const previewColor = color || autoColor(name || 'event')

  function submit(e) {
    e.preventDefault()
    if (!name.trim() || !date) return
    onSave({
      id: initial?.id ?? uid(),
      name: name.trim(),
      date: time ? `${date}T${time}` : date,
      emoji: previewEmoji,
      color: previewColor,
      autoLogo: !emojiOverride,
      mode,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    })
  }

  return (
    <Modal title={initial ? 'Edit event' : 'New event'} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: `${previewColor}22`, border: `1px solid ${previewColor}55` }}
          >
            {previewEmoji}
          </div>
          <input
            autoFocus
            className={inputCls}
            placeholder="Event name (try 'Birthday' or 'Trip to Japan')"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <label className="flex-1 text-sm text-white/60">
            Date
            <input type="date" className={inputCls + ' mt-1'} value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="flex-1 text-sm text-white/60">
            Time (optional)
            <input type="time" className={inputCls + ' mt-1'} value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
        </div>

        <div>
          <p className="text-sm text-white/60 mb-2">Countdown style</p>
          <div className="grid grid-cols-2 gap-2">
            {COUNTDOWN_MODES.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`rounded-lg px-3 py-2 text-sm border transition-colors ${
                  mode === m.id
                    ? 'border-violet-400 bg-violet-500/20 text-white'
                    : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 items-end">
          <label className="block text-sm text-white/60 w-28 shrink-0">
            Custom emoji
            <input
              className={inputCls + ' mt-1 text-center text-xl'}
              placeholder="auto"
              value={emojiOverride}
              onChange={(e) => setEmojiOverride(e.target.value)}
              maxLength={4}
            />
          </label>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white/60 mb-1">Accent color</p>
            <div className="flex gap-1.5 flex-wrap">
              {COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c === color ? '' : c)}
                  className={`w-7 h-7 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className={btnPrimary} disabled={!name.trim() || !date}>
          {initial ? 'Save changes' : 'Add event'}
        </button>
      </form>
    </Modal>
  )
}
