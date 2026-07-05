import { createContext, useContext, useEffect, useReducer } from 'react'
import { loadState, saveState } from './storage.js'

const StoreContext = createContext(null)

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.event] }
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((e) => (e.id === action.event.id ? action.event : e)),
      }
    case 'DELETE_EVENT':
      return { ...state, events: state.events.filter((e) => e.id !== action.id) }
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.goal] }
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map((g) => (g.id === action.goal.id ? action.goal : g)),
      }
    case 'DELETE_GOAL':
      return { ...state, goals: state.goals.filter((g) => g.id !== action.id) }
    case 'ADD_CONTRIBUTION':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.goalId
            ? { ...g, contributions: [...g.contributions, action.contribution] }
            : g
        ),
      }
    case 'DELETE_CONTRIBUTION':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.goalId
            ? { ...g, contributions: g.contributions.filter((c) => c.id !== action.id) }
            : g
        ),
      }
    case 'IMPORT':
      return action.state
    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>
}

export function useStore() {
  return useContext(StoreContext)
}
