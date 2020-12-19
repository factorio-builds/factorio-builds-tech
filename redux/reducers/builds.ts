import { Action } from "redux"
import { ThunkAction } from "redux-thunk"
import { v4 as uuidv4 } from "uuid"
import { Build } from "../../db/entities/build.entity"
import { client as searchClient } from "../../server/services/search.service"
import { IPayloadAction, IStoreState } from "../store"

export interface IStoreBuildsState {
  items: Build[]
}

const initialBuildsState: IStoreBuildsState = {
  items: [],
}

type TSetBuildsAction = IPayloadAction<"SET_BUILDS", Build[]>
type TCreateBuildAction = IPayloadAction<"CREATE_BUILD", Build>
type TUpdateBuildAction = IPayloadAction<"UPDATE_BUILD", Build>
type TSearchBuildsAction = Action<"SEARCH_BUILDS">

export type TBuildsAction =
  | TSetBuildsAction
  | TCreateBuildAction
  | TUpdateBuildAction
  | TSearchBuildsAction

const setBuilds = (
  state: IStoreBuildsState,
  payload: TSetBuildsAction["payload"]
) => {
  return {
    ...state,
    items: payload,
  }
}

const createBuild = (
  state: IStoreBuildsState,
  payload: TCreateBuildAction["payload"]
) => {
  return {
    ...state,
    items: [...state.items, { ...payload, id: uuidv4() }],
  }
}

const updateBuild = (
  state: IStoreBuildsState,
  payload: TCreateBuildAction["payload"]
) => {
  return {
    ...state,
    items: state.items.map((item) => {
      if (item.id === payload.id) {
        return payload
      }

      return item
    }),
  }
}

const searchBuilds = (): ThunkAction<void, IStoreState, unknown, Action> => {
  // const builds = await searchClient.getIndex("builds").search("")

  return async function (dispatch) {
    return searchClient
      .getIndex("builds")
      .search("")
      .then((results) => {
        dispatch({ type: "SET_BUILDS", payload: results.hits })
      })
  }
}

export const buildsReducer = (
  state = initialBuildsState,
  action: TBuildsAction
): IStoreBuildsState => {
  switch (action.type) {
    case "SET_BUILDS":
      return setBuilds(state, action.payload)
    case "CREATE_BUILD":
      return createBuild(state, action.payload)
    case "UPDATE_BUILD":
      return updateBuild(state, action.payload)
    case "SEARCH_BUILDS":
      return searchBuilds(state)
    default:
      return state
  }
}
