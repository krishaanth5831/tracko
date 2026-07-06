import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { VIZ_COMPONENTS } from './vizzes.jsx'
import { uid, useStore } from '../../state/store.jsx'
import { inputCls } from '../ui.jsx'
import { Logo } from '../LogoPicker.jsx'
import { DotMatrix } from './DotMatrix.jsx'

export function GoalCard({ goal, onEdit, onDelete, onOpen }) {
  const { dispatch } = useStore()
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const cardRef = useRef(null)

  const total = goal.contributions.reduce((s, c) => s + c.amount, 0)
  const progress = goal.target > 0 ? total / goal.target : 0
  const prevProgress = useRef(progress)
  const Viz = VIZ_COMPONENTS[goal.viz] ?? VIZ_COMPONENTS.sack

  useEffect(() => {
    if (prevProgress.current < 1 && progress >= 1) {
      const rect = cardRef.current?.getBoundingClientRect()
      confetti({
        particleCount: 120,
        spread: 75,
        origin: rect
          ? { x: (rect.left + rect.width / 2) / innerWidth, y: (rect.top + rect.height / 2) / innerHeight }
          : { y: 0.6 },
      })
    }
    prevProgress.current = progress
  }, [progress])

  function addMoney(e) {
    e.preventDefault()
    const value = parseFloat(amount)
    if (!value || value <= 0) return
    dispatch({
      type: 'ADD_CONTRIBUTION',
      goalId: goal.id,
      contribution: { id: uid(), amount: value, note: note.trim(), date: new Date().toISOString() },
    })
    setAmount('')
    setNote('')
  }

  const fmt = (n) =>
    `${goal.currency}${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`

  return (
    <div
      ref={cardRef}
      onClick={() => onOpen(goal.id)}
      className="card rounded-2xl p-5 flex flex-col gap-4 pop-in relative group cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <Logo image={goal.image} emoji={goal.emoji} />
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{goal.name}</h3>
          <p className="mono text-[10px] text-white/35 mt-0.5">
            {fmt(total)} / {fmt(goal.target)}
            {progress >= 1 && ' · reached'}
          </p>
        </div>
        <span className="ml-auto text-3xl font-bold tabular-nums tracking-tight shrink-0">
          {Math.round(Math.min(progress, 1) * 100)}
          <span className="text-white/30 text-lg">%</span>
        </span>
      </div>

      <Viz progress={progress} />

      <DotMatrix progress={progress} />

      <form onSubmit={addMoney} onClick={(e) => e.stopPropagation()} className="flex gap-2">
        <input
          type="number"
          step="any"
          min="0"
          className={inputCls + ' flex-1'}
          placeholder={`Add ${goal.currency}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className={inputCls + ' flex-1'}
          placeholder="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-lg bg-white text-black hover:bg-white/85 px-3.5 font-bold transition-colors"
        >
          +
        </button>
      </form>

      {goal.contributions.length > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowHistory((s) => !s)
          }}
          className="mono text-[10px] text-white/35 hover:text-white/70 text-left transition-colors"
        >
          {showHistory ? '− hide' : '+ show'} history ({goal.contributions.length})
        </button>
      )}
      {showHistory && (
        <ul onClick={(e) => e.stopPropagation()} className="flex flex-col gap-1 max-h-36 overflow-y-auto text-sm">
          {[...goal.contributions].reverse().map((c) => (
            <li key={c.id} className="flex items-center gap-2 bg-white/5 rounded-lg px-2.5 py-1.5">
              <span className="font-semibold tabular-nums">{fmt(c.amount)}</span>
              <span className="text-white/40 truncate flex-1">{c.note}</span>
              <span className="mono text-[9px] text-white/25">
                {new Date(c.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
              <button
                onClick={() => dispatch({ type: 'DELETE_CONTRIBUTION', goalId: goal.id, id: c.id })}
                className="text-white/25 hover:text-white/70"
                title="Remove"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit(goal)
          }}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-xs text-white/60"
          title="Edit"
        >
          ✎
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(goal.id)
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
