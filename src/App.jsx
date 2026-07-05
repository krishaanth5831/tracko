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
    <div className="max-w-6xl mx-auto px-5 py-10 min-h-screen flex flex-col">
      <header className="flex items-center justify-between mb-12 flex-wrap gap-4">
        <h1 className="mono text-sm font-bold">⏳ TRACKO</h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => exportState(state)}
            className="mono text-[10px] text-white/40 hover:text-white transition-colors"
            title="Download a JSON backup"
          >
            Export
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="mono text-[10px] text-white/40 hover:text-white transition-colors"
            title="Restore from a JSON backup"
          >
            Import
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={onImportFile} />
          <div className="relative">
            <button
              onClick={() => setPickerOpen((o) => !o)}
              className="rounded-full bg-white text-black hover:bg-white/85 px-4 py-1.5 text-sm font-semibold transition-colors"
            >
              + Add
            </button>
            {pickerOpen && (
              <div className="absolute right-0 mt-2 card rounded-xl p-1.5 flex flex-col w-44 z-40 pop-in bg-[#0d0d0d]!">
                <button
                  onClick={() => { setPickerOpen(false); setModal({ type: 'event' }) }}
                  className="text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm"
                >
                  Event countdown
                </button>
                <button
                  onClick={() => { setPickerOpen(false); setModal({ type: 'goal' }) }}
                  className="text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm"
                >
                  Money goal
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {isEmpty ? (
        <div className="text-center py-24 pop-in flex-1">
          <h2 className="text-5xl font-bold tracking-tighter mb-3 text-white/90">Nothing yet.</h2>
          <p className="text-white/40 mb-8 max-w-sm mx-auto">
            Count down to something, or watch a goal fill up.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setModal({ type: 'event' })}
              className="rounded-full bg-white text-black hover:bg-white/85 px-5 py-2.5 font-semibold transition-colors"
            >
              Add an event
            </button>
            <button
              onClick={() => setModal({ type: 'goal' })}
              className="rounded-full border border-white/20 hover:border-white/50 px-5 py-2.5 font-semibold transition-colors"
            >
              Set a goal
            </button>
          </div>
        </div>
      ) : (
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start flex-1">
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

      <footer className="mt-16 flex items-center justify-between mono text-[9px] text-white/25">
        <span>
          {state.events.length} events · {state.goals.length} goals · data local
        </span>
        <a
          href="https://github.com/krishaanth5831/tracko"
          target="_blank"
          rel="noreferrer"
          className="hover:text-white/60 transition-colors"
        >
          open source ↗
        </a>
      </footer>
    </div>
  )
}
