import { Action } from "redux"
import { User } from "../../db/entities/user.entity"
import { IPayloadAction } from "../store"

export interface IStoreAuthState {
  user: User | null
}

export const initialAuthState: IStoreAuthState = {
  user: null,
}

type TSetUserAction = IPayloadAction<"SET_USER", User>
type TUnsetUserAction = Action<"UNSET_USER">

export type TAuthAction = TSetUserAction | TUnsetUserAction

const setUser = (
  state: IStoreAuthState,
  payload: TSetUserAction["payload"]
) => {
  return {
    ...state,
    user: payload,
  }
}

const unsetUser = (state: IStoreAuthState) => {
  return {
    ...state,
    user: null,
  }
}

export const authReducer = (
  state = initialAuthState,
  action: TAuthAction
): IStoreAuthState => {
  switch (action.type) {
    case "SET_USER":
      return setUser(state, action.payload)
    case "UNSET_USER":
      return unsetUser(state)
    default:
      return state
  }
}
