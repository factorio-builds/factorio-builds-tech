import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import {
  createStore,
  applyMiddleware,
  Action,
  combineReducers,
  Reducer,
  Store,
} from "redux"
import type { ThunkDispatch } from "redux-thunk"

// Inline thunk middleware — avoids vite's ESM/CJS interop pitfalls with
// redux-thunk@2's default export. Identical behaviour to the upstream
// implementation (no extraArgument support, which the codebase doesn't use).
const thunk: import("redux").Middleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    if (typeof action === "function") {
      return (action as (
        d: typeof dispatch,
        g: typeof getState
      ) => unknown)(dispatch, getState)
    }
    return next(action)
  }
import reducers from "./reducer"
import { IStoreAuthState, TAuthAction } from "./reducers/auth"
import { IStoreFiltersState, TFiltersAction } from "./reducers/filters"
import { IStoreLayoutState, TLayoutAction } from "./reducers/layout"
import { IStoreSearchState, TSearchAction } from "./reducers/search"

export interface IPayloadAction<T, P> extends Action<T> {
  payload: P
}

export interface IStoreState {
  auth: IStoreAuthState
  filters: IStoreFiltersState
  layout: IStoreLayoutState
  search: IStoreSearchState
}

// Kept as a no-op constant so any consumer that imported HYDRATE from
// next-redux-wrapper still type-checks. We seed via route loaders now.
export const HYDRATE = "__HYDRATE__" as const

export interface IHydratePayload {
  auth?: Partial<IStoreAuthState>
  filters?: Partial<IStoreFiltersState>
  layout?: Partial<IStoreLayoutState>
  search?: Partial<IStoreSearchState>
}

type THydrateAction = IPayloadAction<typeof HYDRATE, IHydratePayload>

type TAction =
  | THydrateAction
  | TAuthAction
  | TFiltersAction
  | TLayoutAction
  | TSearchAction

export type TStore = Store<IStoreState, TAction>

export function makeStore(preloadedState?: Partial<IStoreState>): TStore {
  const combinedReducer = combineReducers({
    ...reducers,
  })

  const reducer: Reducer<IStoreState, TAction> = (state, action) => {
    if (action.type === HYDRATE) {
      return {
        ...(state as IStoreState),
        ...(action as THydrateAction).payload,
      } as IStoreState
    }
    return combinedReducer(state, action)
  }

  const composeEnhancers =
    typeof window !== "undefined" &&
    (window as unknown as {
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
    }).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? (window as unknown as {
          __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose
        }).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose

  return createStore(
    reducer as Reducer<IStoreState, TAction>,
    preloadedState as IStoreState | undefined,
    composeEnhancers(applyMiddleware(thunk))
  )
}

// Re-export `compose` for the devtools branch above.
import { compose } from "redux"

type AppDispatch = ThunkDispatch<IStoreState, undefined, TAction>

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<IStoreState> = useSelector
