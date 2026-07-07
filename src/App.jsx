import { useEffect, useMemo, useRef, useState } from 'react'
import { uid, useStore } from './state/store.jsx'
import { useTabs, sortByOrder } from './state/ui.js'
import { exportState, parseImport } from './state/storage.js'
import { buildShareUrl, parseShareHash, clearShareHash } from './lib/share.js'
import { autoEmoji } from './lib/autoLogo.js'
import { requestNotifyPermission } from './lib/sound.js'
import { useT0Watcher } from './hooks/useT0Watcher.js'
import { TabBar } from './components/TabBar.jsx'
import { FocusView } from './components/FocusView.jsx'
import { EventCard } from './components/events/EventCard.jsx'
import { EventForm } from './components/events/EventForm.jsx'
import { GoalCard } from './components/goals/GoalCard.jsx'
import { GoalForm } from './components/goals/GoalForm.jsx'
import { PixelLogo } from './components/PixelLogo.jsx'
import { PixelLogo3D } from './components/PixelLogo3D.jsx'
import { PixelDissolve } from './components/PixelDissolve.jsx'
import { CommandPalette } from './components/CommandPalette.jsx'
import { WeeklyReview } from './components/WeeklyReview.jsx'
import { ShareView } from './components/ShareView.jsx'

export default function App() {
  const { state, dispatch } = useStore()
  const [modal, setModal] = useState(null) // {type:'event'|'goal', initial?}
  const [pickerOpen, setPickerOpen] = useState(false)
  const [shared, setShared] = useState(() => parseShareHash())
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)
  const dragId = useRef(null)
  const fileRef = useRef(null)

  const validIds = useMemo(
    () => new Set([...state.events.map((e) => e.id), ...state.goals.map((g) => g.id)]),
    [state.events, state.goals]
  )
  const tabs = useTabs(validIds)
  const tabsRef = useRef(tabs)
  tabsRef.current = tabs

  useT0Watcher(state.events, tabs.alerts)

  // ?zen&cycle=30 — screensaver slideshow rotating through the open tabs
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const cycle = parseFloat(params.get('cycle'))
    if (!params.has('zen') || !cycle || cycle <= 0) return
    const iv = setInterval(() => {
      const t = tabsRef.current
      if (t.open.length === 0) return
      const idx = t.open.indexOf(t.active)
      t.goTo(t.open[(idx + 1) % t.open.length])
    }, cycle * 1000)
    return () => clearInterval(iv)
  }, [])

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

  const orderedCards = useMemo(
    () =>
      sortByOrder(
        [
          ...state.events.map((e) => ({ id: e.id, kind: 'event', item: e })),
          ...state.goals.map((g) => ({ id: g.id, kind: 'goal', item: g })),
        ],
        tabs.order
      ),
    [state.events, state.goals, tabs.order]
  )

  function showToast(msg) {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2200)
  }

  function shareItem(item, kind) {
    const url = buildShareUrl(item, kind)
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => showToast('Share link copied'), () => window.prompt('Copy this link:', url))
    } else {
      window.prompt('Copy this link:', url)
    }
  }

  function addShared() {
    const { kind, item } = shared
    if (kind === 'event') {
      dispatch({
        type: 'ADD_EVENT',
        event: {
          mode: 'days',
          repeat: 'none',
          emoji: autoEmoji(item.name),
          image: null,
          ...item,
          id: uid(),
          createdAt: new Date().toISOString(),
        },
      })
    } else {
      dispatch({
        type: 'ADD_GOAL',
        goal: {
          currency: '$',
          emoji: '💰',
          viz: 'sack',
          image: null,
          contributions: [],
          ...item,
          id: uid(),
          createdAt: new Date().toISOString(),
        },
      })
    }
    clearShareHash()
    setShared(null)
    showToast('Added to your Tracko')
  }

  function moveCard(src, dst) {
    if (!src || src === dst) return
    const ids = orderedCards.map((c) => c.id)
    const from = ids.indexOf(src)
    const to = ids.indexOf(dst)
    if (from === -1 || to === -1) return
    ids.splice(from, 1)
    ids.splice(to, 0, src)
    tabs.setOrder(ids)
  }

  const dropProps = (id) => ({
    onDragOver: (e) => e.preventDefault(),
    onDrop: (e) => {
      e.preventDefault()
      moveCard(dragId.current, id)
    },
  })

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

  const paletteActions = useMemo(
    () => [
      { id: 'new-event', label: 'New event countdown', hint: 'create', run: () => setModal({ type: 'event' }) },
      { id: 'new-goal', label: 'New money goal', hint: 'create', run: () => setModal({ type: 'goal' }) },
      { id: 'go-home', label: 'Go home', hint: 'nav', run: () => tabsRef.current.goTo('home') },
      { id: 'export', label: 'Export backup JSON', hint: 'data', run: () => exportState(state) },
      ...orderedCards.map(({ id, kind, item }) => ({
        id,
        label: `Open · ${item.name}`,
        hint: kind,
        run: () => tabsRef.current.openTab(id),
      })),
    ],
    [orderedCards, state]
  )

  return (
    <div className="max-w-6xl mx-auto px-5 py-8 min-h-screen flex flex-col">
      <header className="ui-chrome relative z-10 flex items-center justify-between mb-6 flex-wrap gap-4">
        <button
          onClick={() => tabs.goTo('home')}
          className="flex items-center gap-3 mono text-sm font-bold hover:text-white/70 transition-colors"
        >
          <PixelLogo px={3} gap={1} />
          TRACKO
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
          onShare={shareItem}
        />
      ) : isEmpty ? (
        <div className="text-center pop-in flex-1 flex flex-col items-center justify-center">
          <PixelLogo3D className="w-full max-w-md h-64 mb-6" />
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
          <WeeklyReview events={state.events} goals={state.goals} />
          {orderedCards.map(({ id, kind, item }) => (
            <div key={id} className="relative group/wrap">
              <span
                draggable
                onDragStart={(e) => {
                  dragId.current = id
                  e.dataTransfer.effectAllowed = 'move'
                  const card = e.currentTarget.parentElement
                  if (card) e.dataTransfer.setDragImage(card, 60, 40)
                }}
                onDragEnd={() => (dragId.current = null)}
                className="absolute top-3 left-3 z-10 w-6 h-6 rounded-lg bg-white/5 hover:bg-white/15 text-white/50 text-[10px] leading-6 text-center cursor-grab opacity-0 group-hover/wrap:opacity-100 transition-opacity select-none"
                title="Drag to reorder"
              >
                ⠿
              </span>
              {kind === 'event' ? (
                <EventCard
                  event={item}
                  onOpen={tabs.openTab}
                  onShare={shareItem}
                  onEdit={(e) => setModal({ type: 'event', initial: e })}
                  onDelete={(eid) => dispatch({ type: 'DELETE_EVENT', id: eid })}
                  dragProps={dropProps(id)}
                />
              ) : (
                <GoalCard
                  goal={item}
                  onOpen={tabs.openTab}
                  onShare={shareItem}
                  onEdit={(g) => setModal({ type: 'goal', initial: g })}
                  onDelete={(gid) => dispatch({ type: 'DELETE_GOAL', id: gid })}
                  dragProps={dropProps(id)}
                />
              )}
            </div>
          ))}
        </main>
      )}

      {modal?.type === 'event' && (
        <EventForm initial={modal.initial} onSave={saveEvent} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'goal' && (
        <GoalForm initial={modal.initial} onSave={saveGoal} onClose={() => setModal(null)} />
      )}
      {shared && (
        <ShareView
          kind={shared.kind}
          item={shared.item}
          onAdd={addShared}
          onDismiss={() => {
            clearShareHash()
            setShared(null)
          }}
        />
      )}

      <CommandPalette actions={paletteActions} />
      <PixelDissolve trigger={tabs.active} />

      {toast && (
        <div className="fixed inset-x-0 bottom-8 z-50 flex justify-center pointer-events-none">
          <span className="toast-in mono text-[10px] bg-white text-black rounded-full px-4 py-2">
            {toast}
          </span>
        </div>
      )}

      <footer className="ui-chrome relative z-10 mt-16 flex items-center justify-between mono text-[9px] text-white/25">
        <span>
          {state.events.length} events · {state.goals.length} goals · data local
        </span>
        <div className="flex items-center gap-5">
          <button
            onClick={() => {
              if (!tabs.alerts) requestNotifyPermission()
              tabs.toggleAlerts()
              showToast(tabs.alerts ? 'T-0 alerts off' : 'T-0 alerts on')
            }}
            className="hover:text-white/60 transition-colors"
            title="Chime + notification when a countdown hits zero"
          >
            alerts {tabs.alerts ? 'on' : 'off'}
          </button>
          <span className="text-white/15">⌘K</span>
          <a
            href="https://github.com/krishaanth5831/tracko"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white/60 transition-colors"
          >
            open source ↗
          </a>
        </div>
      </footer>
    </div>
  )
}
