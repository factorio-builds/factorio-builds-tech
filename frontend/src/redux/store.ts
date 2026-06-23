import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import {
  compose,
  createStore,
  combineReducers,
  Action,
  Dispatch,
  Reducer,
  Store,
} from "redux"
import reducers from "./reducer"
import { IStoreAuthState, TAuthAction } from "./reducers/auth"
import { IStoreFiltersState, TFiltersAction } from "./reducers/filters"
import { IStoreLayoutState, TLayoutAction } from "./reducers/layout"

export interface IPayloadAction<T, P> extends Action<T> {
  payload: P
}

export interface IStoreState {
  auth: IStoreAuthState
  filters: IStoreFiltersState
  layout: IStoreLayoutState
}

// Kept as a no-op constant so any consumer that imported HYDRATE from
// next-redux-wrapper still type-checks. We seed via route loaders now.
export const HYDRATE = "__HYDRATE__" as const

export interface IHydratePayload {
  auth?: Partial<IStoreAuthState>
  filters?: Partial<IStoreFiltersState>
  layout?: Partial<IStoreLayoutState>
}

type THydrateAction = IPayloadAction<typeof HYDRATE, IHydratePayload>

type TAction =
  | THydrateAction
  | TAuthAction
  | TFiltersAction
  | TLayoutAction

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
    composeEnhancers()
  )
}

type AppDispatch = Dispatch<TAction>

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<IStoreState> = useSelector
