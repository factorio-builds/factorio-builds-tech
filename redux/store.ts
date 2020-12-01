import { createWrapper, HYDRATE, MakeStore } from "next-redux-wrapper"
import {
  createStore,
  applyMiddleware,
  Action,
  combineReducers,
  Reducer,
} from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import reducers from "./reducer"
import { IStoreAuthState, TAuthAction } from "./reducers/auth"
import { IStoreBuildsState, TBuildsAction } from "./reducers/builds"
import { IStoreFiltersState, TFiltersAction } from "./reducers/filters"

export interface IPayloadAction<T, P> extends Action<T> {
  payload: P
}

export interface IStoreState {
  auth: IStoreAuthState
  builds: IStoreBuildsState
  filters: IStoreFiltersState
}

type THydrateAction = IPayloadAction<typeof HYDRATE, any>

type TAction = THydrateAction | TAuthAction | TBuildsAction | TFiltersAction

export const makeStore: MakeStore<IStoreState, TAction> = () => {
  const combinedReducer = combineReducers({
    ...reducers,
  })

  const reducer: Reducer<IStoreState, TAction> = (state, action) => {
    if (action.type === HYDRATE) {
      const nextState: IStoreState = {
        ...state, // use previous state
        ...action.payload, // apply delta from hydration
      }
      return nextState
    } else {
      return combinedReducer(state, action)
    }
  }

  const store = createStore(reducer, composeWithDevTools(applyMiddleware()))

  // @ts-ignore
  if (module.hot) {
    // @ts-ignore
    module.hot.accept("./reducer", () => {
      console.info("Replacing reducer")
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      store.replaceReducer(require("./reducer").default)
    })
  }

  return store
}

export const wrapper = createWrapper<IStoreState, TAction>(makeStore, {
  debug: process.env.DEBUG_REDUX === "true",
})
