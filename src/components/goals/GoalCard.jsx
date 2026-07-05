import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { MoneySack } from './MoneySack.jsx'
import { uid, useStore } from '../../state/store.jsx'
import { inputCls } from '../ui.jsx'

export function GoalCard({ goal, onEdit, onDelete }) {
  const { dispatch } = useStore()
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const cardRef = useRef(null)

  const total = goal.contributions.reduce((s, c) => s + c.amount, 0)
  const progress = goal.target > 0 ? total / goal.target : 0
  const prevProgress = useRef(progress)

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
      className="card-glass rounded-2xl p-5 flex flex-col gap-3 pop-in relative group"
      style={{ boxShadow: '0 0 40px -12px #f59e0b55' }}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 bg-amber-500/15 border border-amber-500/30">
          {goal.emoji}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{goal.name}</h3>
          <p className="text-xs text-white/50">
            {fmt(total)} of {fmt(goal.target)}
            {progress >= 1 && ' · 🎉 goal reached!'}
          </p>
        </div>
      </div>

      <MoneySack progress={progress} />

      <form onSubmit={addMoney} className="flex gap-2">
        <input
          type="number"
          step="any"
          min="0"
          className={inputCls + ' flex-1'}
          placeholder={`Add ${goal.currency}…`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className={inputCls + ' flex-1'}
          placeholder="note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-lg bg-amber-500 hover:bg-amber-400 px-3 font-bold text-black transition-colors"
        >
          +
        </button>
      </form>

      {goal.contributions.length > 0 && (
        <button
          onClick={() => setShowHistory((s) => !s)}
          className="text-xs text-white/50 hover:text-white/80 text-left"
        >
          {showHistory ? '▾ hide' : '▸ show'} history ({goal.contributions.length})
        </button>
      )}
      {showHistory && (
        <ul className="flex flex-col gap-1 max-h-36 overflow-y-auto text-sm">
          {[...goal.contributions].reverse().map((c) => (
            <li key={c.id} className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1">
              <span className="font-semibold text-amber-300">{fmt(c.amount)}</span>
              <span className="text-white/50 truncate flex-1">{c.note}</span>
              <span className="text-white/30 text-xs">
                {new Date(c.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
              <button
                onClick={() => dispatch({ type: 'DELETE_CONTRIBUTION', goalId: goal.id, id: c.id })}
                className="text-white/30 hover:text-red-400"
                title="Remove"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(goal)} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-xs" title="Edit">
          ✏️
        </button>
        <button onClick={() => onDelete(goal.id)} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-red-500/40 text-xs" title="Delete">
          🗑️
        </button>
      </div>
    </div>
  )
}
