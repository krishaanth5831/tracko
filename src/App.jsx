import { useRef, useState } from 'react'
import { useStore } from './state/store.jsx'
import { exportState, parseImport } from './state/storage.js'
import { EventCard } from './components/events/EventCard.jsx'
import { EventForm } from './components/events/EventForm.jsx'
import { GoalCard } from './components/goals/GoalCard.jsx'
import { GoalForm } from './components/goals/GoalForm.jsx'

export default function App() {
  const { state, dispatch } = useStore()
  const [modal, setModal] = useState(null) // {type:'event'|'goal', initial?}
  const [pickerOpen, setPickerOpen] = useState(false)
  const fileRef = useRef(null)

  const isEmpty = state.events.length === 0 && state.goals.length === 0

  function saveEvent(event) {
    dispatch({ type: modal.initial ? 'UPDATE_EVENT' : 'ADD_EVENT', event })
    setModal(null)
  }
  function saveGoal(goal) {
    dispatch({ type: modal.initial ? 'UPDATE_GOAL' : 'ADD_GOAL', goal })
    setModal(null)
  }

  function onImportFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    file.text().then((text) => {
      try {
        dispatch({ type: 'IMPORT', state: parseImport(text) })
      } catch {
        alert('That file is not a valid Tracko backup.')
      }
    })
    e.target.value = ''
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            ⏳ Tracko
          </h1>
          <p className="text-sm text-white/50">countdowns & goals, at a glance</p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => exportState(state)}
            className="rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 text-sm"
            title="Download a JSON backup"
          >
            Export
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 text-sm"
            title="Restore from a JSON backup"
          >
            Import
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={onImportFile} />
          <div className="relative">
            <button
              onClick={() => setPickerOpen((o) => !o)}
              className="rounded-lg bg-violet-500 hover:bg-violet-400 px-4 py-2 font-semibold transition-colors"
            >
              + Add
            </button>
            {pickerOpen && (
              <div className="absolute right-0 mt-2 card-glass rounded-xl p-1.5 flex flex-col w-44 z-40 pop-in bg-[#16132b]!">
                <button
                  onClick={() => { setPickerOpen(false); setModal({ type: 'event' }) }}
                  className="text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm"
                >
                  📅 Event countdown
                </button>
                <button
                  onClick={() => { setPickerOpen(false); setModal({ type: 'goal' }) }}
                  className="text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm"
                >
                  💰 Money goal
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {isEmpty ? (
        <div className="text-center py-24 pop-in">
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="text-xl font-bold mb-2">Nothing tracked yet</h2>
          <p className="text-white/50 mb-6 max-w-sm mx-auto">
            Add an event to count down to, or set a money goal and watch the sack fill up.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setModal({ type: 'event' })}
              className="rounded-lg bg-violet-500 hover:bg-violet-400 px-4 py-2.5 font-semibold"
            >
              📅 Add an event
            </button>
            <button
              onClick={() => setModal({ type: 'goal' })}
              className="rounded-lg bg-amber-500 hover:bg-amber-400 px-4 py-2.5 font-semibold text-black"
            >
              💰 Set a goal
            </button>
          </div>
        </div>
      ) : (
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {state.events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={(e) => setModal({ type: 'event', initial: e })}
              onDelete={(id) => dispatch({ type: 'DELETE_EVENT', id })}
            />
          ))}
          {state.goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={(g) => setModal({ type: 'goal', initial: g })}
              onDelete={(id) => dispatch({ type: 'DELETE_GOAL', id })}
            />
          ))}
        </main>
      )}

      {modal?.type === 'event' && (
        <EventForm initial={modal.initial} onSave={saveEvent} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'goal' && (
        <GoalForm initial={modal.initial} onSave={saveGoal} onClose={() => setModal(null)} />
      )}

      <footer className="mt-12 text-center text-xs text-white/30">
        open source ·{' '}
        <a
          href="https://github.com/krishaanth5831/tracko"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-white/60"
        >
          github.com/krishaanth5831/tracko
        </a>{' '}
        · data stays in your browser
      </footer>
    </div>
  )
}
