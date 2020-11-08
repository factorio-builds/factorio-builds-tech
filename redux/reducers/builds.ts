import { v4 as uuidv4 } from "uuid"
import { IBuild } from "../../types"
import { IPayloadAction } from "../store"

export interface IStoreBuildsState {
  items: IBuild[]
}

const initialBuildsState: IStoreBuildsState = {
  items: [],
}

type TSetBuildsAction = IPayloadAction<"SET_BUILDS", IBuild[]>
type TCreateBuildAction = IPayloadAction<"CREATE_BUILD", IBuild>
type TUpdateBuildAction = IPayloadAction<"UPDATE_BUILD", IBuild>

export type TBuildsAction =
  | TSetBuildsAction
  | TCreateBuildAction
  | TUpdateBuildAction

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
    default:
      return state
  }
}
