import { IBuild } from "../../types"
import { IPayloadAction } from "../store"

export interface IStoreBuildsState {
  items: IBuild[]
}

export const initialBuildsState: IStoreBuildsState = {
  items: [],
}

type TSetBuildsAction = IPayloadAction<"SET_BUILDS", IBuild[]>

export type TBuildsAction = TSetBuildsAction

const setBuilds = (
  state: IStoreBuildsState,
  payload: TSetBuildsAction["payload"]
) => {
  return {
    ...state,
    items: payload,
  }
}

export const buildsReducer = (
  state = initialBuildsState,
  action: TBuildsAction
): IStoreBuildsState => {
  switch (action.type) {
    case "SET_BUILDS":
      return setBuilds(state, action.payload)
    default:
      return state
  }
}
