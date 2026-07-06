import { useEffect, useMemo, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { useNow } from '../hooks/useNow.js'
import { useIdle } from '../hooks/useIdle.js'
import { uid, useStore } from '../state/store.jsx'
import { MODE_COMPONENTS } from './events/countdownModes.jsx'
import { VIZ_COMPONENTS } from './goals/vizzes.jsx'
import { DotMatrix } from './goals/DotMatrix.jsx'
import { Logo } from './LogoPicker.jsx'
import { Spline3D, SCENES } from './Spline3D.jsx'
import { inputCls } from './ui.jsx'

// Fullscreen view for one tracker. Clicking anywhere except the content
// toggles the logo between small-above-timer (black bg) and full background.
export function FocusView({ item, kind, onHome }) {
  const [bgLogo, setBgLogo] = useState(false)

  // Ambient screensaver: after ~5s of no input the chrome fades away and the
  // tracker becomes a pure clock, Fliqlo-style. ?zen starts idle immediately.
  const zen = useMemo(() => new URLSearchParams(window.location.search).has('zen'), [])
  const [idle, wokeAt] = useIdle(5000, zen)
  const [hintDone, setHintDone] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('zen-idle', idle)
    return () => document.body.classList.remove('zen-idle')
  }, [idle])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onHome()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onHome])

  function onBackdropClick() {
    // the click that wakes the screensaver should only wake, not toggle the bg
    if (Date.now() - wokeAt.current < 400) return
    setBgLogo((b) => !b)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
      {/* full-viewport click layer: anywhere except the content toggles the bg */}
      <div
        className="fixed inset-0 cursor-pointer"
        onClick={onBackdropClick}
        title={bgLogo ? 'Click to bring the logo back up' : 'Click to use the logo as background'}
      />

      {/* full-viewport background layer */}
      <div
        className={`fixed inset-0 -z-10 transition-opacity duration-700 ${
          bgLogo ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {item.image ? (
          <>
            <img
              src={item.image.dataUrl ?? item.image.url ?? item.image.thumb}
              alt=""
              className={`w-full h-full object-cover ${idle && bgLogo ? 'kenburns' : ''}`}
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
          </>
        ) : (
          bgLogo && (
            <>
              <Spline3D scene={SCENES.cube} dim className="w-full h-full" />
              <div className="absolute inset-0 bg-black/30 pointer-events-none" />
            </>
          )
        )}
      </div>

      {/* slight dim while the screensaver is on */}
      <div
        className={`fixed inset-0 z-20 bg-black pointer-events-none transition-opacity duration-700 ${
          idle ? 'opacity-30' : 'opacity-0'
        }`}
      />

      {idle && !hintDone && (
        <p
          className="zen-hint fixed bottom-10 left-1/2 -translate-x-1/2 mono text-[10px] text-white/50 pointer-events-none"
          onAnimationEnd={() => setHintDone(true)}
        >
          Move to wake
        </p>
      )}

      <div
        className={`relative flex flex-col items-center gap-6 transition-transform duration-700 ${
          idle ? 'scale-[1.08]' : 'scale-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`transition-all duration-500 flex flex-col items-center gap-6 ${
            bgLogo ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-40'
          }`}
        >
          <Logo image={item.image} emoji={item.emoji} size="w-20 h-20" />
        </div>

        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{item.name}</h2>
          {kind === 'event' && (
            <p className="mono text-[11px] text-white/40 mt-2">
              {new Date(item.date).toLocaleString(undefined, {
                dateStyle: 'full',
                timeStyle: item.date.includes('T') ? 'short' : undefined,
              })}
            </p>
          )}
        </div>

        {kind === 'event' ? <EventFocus event={item} /> : <GoalFocus goal={item} />}
      </div>
    </div>
  )
}

function EventFocus({ event }) {
  const needsSeconds = event.mode === 'live' || event.mode === 'full'
  const now = useNow(needsSeconds ? 1000 : 30000)
  const Mode = MODE_COMPONENTS[event.mode] ?? MODE_COMPONENTS.days
  return (
    <div className="mt-4">
      <Mode date={event.date} now={now} big />
    </div>
  )
}

function GoalFocus({ goal }) {
  const { dispatch } = useStore()
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const total = goal.contributions.reduce((s, c) => s + c.amount, 0)
  const progress = goal.target > 0 ? total / goal.target : 0
  const prevProgress = useRef(progress)
  const Viz = VIZ_COMPONENTS[goal.viz] ?? VIZ_COMPONENTS.sack

  useEffect(() => {
    if (prevProgress.current < 1 && progress >= 1) {
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.5 } })
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

  const fmt = (n) => `${goal.currency}${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <div className="text-center">
        <span className="text-8xl font-bold tabular-nums tracking-tighter">
          {Math.round(Math.min(progress, 1) * 100)}
          <span className="text-white/30 text-4xl">%</span>
        </span>
        <p className="mono text-[11px] text-white/40 mt-2">
          {fmt(total)} / {fmt(goal.target)}
          {progress >= 1 && ' · reached'}
        </p>
      </div>

      <Viz progress={progress} size="w-52 h-52" />
      <DotMatrix progress={progress} total={80} cols={40} />

      <form onSubmit={addMoney} className="flex gap-2 w-full">
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
          className="rounded-lg bg-white text-black hover:bg-white/85 px-4 font-bold transition-colors"
        >
          +
        </button>
      </form>

      {goal.contributions.length > 0 && (
        <ul className="flex flex-col gap-1 max-h-40 overflow-y-auto text-sm w-full">
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
    </div>
  )
}
