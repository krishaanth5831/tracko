import { useMemo, useRef, useState } from 'react'
import { useStore } from './state/store.jsx'
import { useTabs } from './state/ui.js'
import { exportState, parseImport } from './state/storage.js'
import { TabBar } from './components/TabBar.jsx'
import { FocusView } from './components/FocusView.jsx'
import { EventCard } from './components/events/EventCard.jsx'
import { EventForm } from './components/events/EventForm.jsx'
import { GoalCard } from './components/goals/GoalCard.jsx'
import { GoalForm } from './components/goals/GoalForm.jsx'
import { Spline3D, SCENES } from './components/Spline3D.jsx'

export default function App() {
  const { state, dispatch } = useStore()
  const [modal, setModal] = useState(null) // {type:'event'|'goal', initial?}
  const [pickerOpen, setPickerOpen] = useState(false)
  const fileRef = useRef(null)

  const validIds = useMemo(
    () => new Set([...state.events.map((e) => e.id), ...state.goals.map((g) => g.id)]),
    [state.events, state.goals]
  )
  const tabs = useTabs(validIds)

  const findItem = (id) => {
    const event = state.events.find((e) => e.id === id)
    if (event) return { item: event, kind: 'event' }
    const goal = state.goals.find((g) => g.id === id)
    if (goal) return { item: goal, kind: 'goal' }
    return null
  }

  const openTabs = tabs.open
    .map((id) => {
      const found = findItem(id)
      return found ? { id, name: found.item.name } : null
    })
    .filter(Boolean)

  const focused = tabs.active !== 'home' ? findItem(tabs.active) : null
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
    <div className="max-w-6xl mx-auto px-5 py-8 min-h-screen flex flex-col">
      <header className="relative z-10 flex items-center justify-between mb-6 flex-wrap gap-4">
        <button onClick={() => tabs.goTo('home')} className="mono text-sm font-bold hover:text-white/70 transition-colors">
          ⏳ TRACKO
        </button>
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

      <TabBar tabs={openTabs} active={tabs.active} onSelect={tabs.goTo} onClose={tabs.closeTab} />

      {focused ? (
        <FocusView
          key={focused.item.id}
          item={focused.item}
          kind={focused.kind}
          onHome={() => tabs.goTo('home')}
        />
      ) : isEmpty ? (
        <div className="text-center pop-in flex-1 flex flex-col items-center justify-center">
          <Spline3D scene={SCENES.cube} className="w-full max-w-md h-64 mb-2" />
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
              onOpen={tabs.openTab}
              onEdit={(e) => setModal({ type: 'event', initial: e })}
              onDelete={(id) => dispatch({ type: 'DELETE_EVENT', id })}
            />
          ))}
          {state.goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onOpen={tabs.openTab}
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

      <footer className="relative z-10 mt-16 flex items-center justify-between mono text-[9px] text-white/25">
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
