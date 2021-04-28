import { createWrapper, HYDRATE, MakeStore } from "next-redux-wrapper"
import { createStore, applyMiddleware, Action, combineReducers, Reducer } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import thunk from "redux-thunk"
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

type THydrateAction = IPayloadAction<typeof HYDRATE, any>

type TAction = THydrateAction | TAuthAction | TFiltersAction | TLayoutAction | TSearchAction

const makeStore: MakeStore<IStoreState, TAction> = () => {
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

  const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

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
