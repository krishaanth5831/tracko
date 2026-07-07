import { useState } from 'react'
import { uid } from '../../state/store.jsx'
import { Modal, inputCls, btnPrimary } from '../ui.jsx'
import { LogoPicker } from '../LogoPicker.jsx'
import { GOAL_VIZZES, VIZ_COMPONENTS } from './vizzes.jsx'

export function GoalForm({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [target, setTarget] = useState(initial?.target ?? '')
  const [currency, setCurrency] = useState(initial?.currency ?? '$')
  const [viz, setViz] = useState(initial?.viz ?? 'sack')
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
      viz,
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

        <div>
          <p className="mono text-[10px] text-white/40 mb-2">Visualization</p>
          <div className="grid grid-cols-3 gap-2">
            {GOAL_VIZZES.map((v) => {
              const Viz = VIZ_COMPONENTS[v.id]
              return (
                <button
                  type="button"
                  key={v.id}
                  onClick={() => setViz(v.id)}
                  className={`rounded-lg px-2 py-2.5 text-xs border transition-colors flex flex-col items-center gap-1.5 ${
                    viz === v.id
                      ? 'border-white bg-white/10 text-white'
                      : 'border-white/10 bg-white/5 text-white/50 hover:border-white/30'
                  }`}
                >
                  <Viz progress={0.65} size="w-10 h-10" />
                  {v.label}
                </button>
              )
            })}
          </div>
        </div>

        <LogoPicker query={name} value={image} onChange={setImage} fallbackEmoji="💰" />

        <button type="submit" className={btnPrimary} disabled={!name.trim() || !parseFloat(target)}>
          {initial ? 'Save changes' : 'Create goal'}
        </button>
      </form>
    </Modal>
  )
}
