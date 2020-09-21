import { v4 as uuidv4 } from "uuid"
import { IBuild } from "../../types"
import { mockedBuilds } from "../../utils/mock-builds-data"
import { IPayloadAction } from "../store"

export interface IStoreBuildsState {
  items: IBuild[]
}

export const initialBuildsState: IStoreBuildsState = {
  items: mockedBuilds,
}

type TSetBuildsAction = IPayloadAction<"SET_BUILDS", IBuild[]>
type TCreateBuildAction = IPayloadAction<"CREATE_BUILD", IBuild>

export type TBuildsAction = TSetBuildsAction | TCreateBuildAction

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

export const buildsReducer = (
  state = initialBuildsState,
  action: TBuildsAction
): IStoreBuildsState => {
  switch (action.type) {
    case "SET_BUILDS":
      return setBuilds(state, action.payload)
    case "CREATE_BUILD":
      return createBuild(state, action.payload)
    default:
      return state
  }
}
