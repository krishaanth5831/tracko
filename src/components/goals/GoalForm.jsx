import { useState } from 'react'
import { uid } from '../../state/store.jsx'
import { Modal, inputCls, btnPrimary } from '../ui.jsx'

export function GoalForm({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [target, setTarget] = useState(initial?.target ?? '')
  const [currency, setCurrency] = useState(initial?.currency ?? '$')
  const [emoji, setEmoji] = useState(initial?.emoji ?? '💰')

  function submit(e) {
    e.preventDefault()
    const t = parseFloat(target)
    if (!name.trim() || !t || t <= 0) return
    onSave({
      id: initial?.id ?? uid(),
      name: name.trim(),
      target: t,
      currency,
      emoji: emoji || '💰',
      contributions: initial?.contributions ?? [],
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    })
  }

  return (
    <Modal title={initial ? 'Edit goal' : 'New goal'} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <input
          autoFocus
          className={inputCls}
          placeholder="Goal name (e.g. Summer earnings)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex gap-3">
          <label className="w-24 text-sm text-white/60">
            Currency
            <input className={inputCls + ' mt-1 text-center'} value={currency} onChange={(e) => setCurrency(e.target.value)} maxLength={3} />
          </label>
          <label className="flex-1 text-sm text-white/60">
            Target amount
            <input
              type="number"
              step="any"
              min="0"
              className={inputCls + ' mt-1'}
              placeholder="1000"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </label>
          <label className="w-24 text-sm text-white/60">
            Emoji
            <input className={inputCls + ' mt-1 text-center text-xl'} value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={4} />
          </label>
        </div>
        <button type="submit" className={btnPrimary} disabled={!name.trim() || !parseFloat(target)}>
          {initial ? 'Save changes' : 'Create goal'}
        </button>
      </form>
    </Modal>
  )
}
