import { useMemo } from "react"
import { createStore, applyMiddleware, Action, Store } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { IBuild } from "../types"

interface IPayloadAction<T, P> extends Action<T> {
  payload: P
}

let store: Store<IStoreState, TAction> | undefined

export interface IStoreState {
  builds: IBuild[]
}

const initialState: IStoreState = {
  builds: [],
}

type TSetBuildsAction = IPayloadAction<"SET_BUILDS", IBuild[]>

type TAction = TSetBuildsAction

const setBuilds = (
  state: IStoreState,
  payload: TSetBuildsAction["payload"]
) => {
  return {
    ...state,
    builds: payload,
  }
}

const reducer = (state = initialState, action: TAction): IStoreState => {
  switch (action.type) {
    case "SET_BUILDS":
      return setBuilds(state, action.payload)
    default:
      return state
  }
}

function initStore(preloadedState = initialState) {
  return createStore<IStoreState, TAction, {}, {}>(
    reducer,
    preloadedState,
    composeWithDevTools(applyMiddleware())
  )
}

export const initializeStore = (preloadedState: IStoreState) => {
  let _store = store ?? initStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}

export function useStore(initialState: IStoreState) {
  const store = useMemo(() => initializeStore(initialState), [initialState])
  return store
}
