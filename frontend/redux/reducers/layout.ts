import { Action } from "redux"
import { IPayloadAction } from "../store"

export interface IStoreLayoutState {
  sidebar: boolean
}

const initialLayoutState: IStoreLayoutState = {
  sidebar: false,
}

type TSetSidebarAction = IPayloadAction<"SET_SIDEBAR", boolean>
type TToggleSidebarAction = Action<"TOGGLE_SIDEBAR">

export type TLayoutAction = TSetSidebarAction | TToggleSidebarAction

const setSidebar = (state: IStoreLayoutState, payload: TSetSidebarAction["payload"]) => {
  return {
    ...state,
    sidebar: payload,
  }
}

const toggleSidebar = (state: IStoreLayoutState) => {
  return {
    ...state,
    sidebar: !state.sidebar,
  }
}

export const layoutReducer = (state = initialLayoutState, action: TLayoutAction): IStoreLayoutState => {
  switch (action.type) {
    case "SET_SIDEBAR":
      return setSidebar(state, action.payload)
    case "TOGGLE_SIDEBAR":
      return toggleSidebar(state)
    default:
      return state
  }
}
