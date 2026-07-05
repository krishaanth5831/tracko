import { useState } from 'react'
import { uid } from '../../state/store.jsx'
import { Modal, inputCls, btnPrimary } from '../ui.jsx'
import { LogoPicker } from '../LogoPicker.jsx'

export function GoalForm({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [target, setTarget] = useState(initial?.target ?? '')
  const [currency, setCurrency] = useState(initial?.currency ?? '$')
  const [image, setImage] = useState(initial?.image ?? null)

  function submit(e) {
    e.preventDefault()
    const t = parseFloat(target)
    if (!name.trim() || !t || t <= 0) return
    onSave({
      id: initial?.id ?? uid(),
      name: name.trim(),
      target: t,
      currency,
      emoji: initial?.emoji ?? '💰',
      image,
      contributions: initial?.contributions ?? [],
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    })
  }

  return (
    <Modal title={initial ? 'Edit goal' : 'New goal'} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-5">
        <input
          autoFocus
          className={inputCls + ' text-lg'}
          placeholder="Goal name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex gap-3">
          <label className="w-24 mono text-[10px] text-white/40">
            Currency
            <input className={inputCls + ' mt-1.5 text-center font-sans normal-case tracking-normal'} value={currency} onChange={(e) => setCurrency(e.target.value)} maxLength={3} />
          </label>
          <label className="flex-1 mono text-[10px] text-white/40">
            Target amount
            <input
              type="number"
              step="any"
              min="0"
              className={inputCls + ' mt-1.5 font-sans normal-case tracking-normal'}
              placeholder="1000"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </label>
        </div>

        <LogoPicker query={name} value={image} onChange={setImage} fallbackEmoji="💰" />

        <button type="submit" className={btnPrimary} disabled={!name.trim() || !parseFloat(target)}>
          {initial ? 'Save changes' : 'Create goal'}
        </button>
      </form>
    </Modal>
  )
}
