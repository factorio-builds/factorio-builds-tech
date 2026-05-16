import { Action } from "redux"
import { IPayloadAction } from "../store"

interface IStateHeaderPreInit {
  init: false
}

interface IStateHeaderInit {
  init: true
  height: number
}

type IStateHeader = IStateHeaderPreInit | IStateHeaderInit

export interface IStoreLayoutState {
  sidebar: boolean
  header: IStateHeader
}

const initialLayoutState: IStoreLayoutState = {
  sidebar: false,
  header: {
    init: false,
  },
}

type TSetSidebarAction = IPayloadAction<"SET_SIDEBAR", boolean>
type TToggleSidebarAction = Action<"TOGGLE_SIDEBAR">
type TSetHeaderAction = IPayloadAction<"SET_HEADER", number>

export type TLayoutAction =
  | TSetSidebarAction
  | TToggleSidebarAction
  | TSetHeaderAction

const setSidebar = (
  state: IStoreLayoutState,
  payload: TSetSidebarAction["payload"]
) => {
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

const setHeader = (
  state: IStoreLayoutState,
  payload: TSetHeaderAction["payload"]
) => {
  return {
    ...state,
    header: {
      init: true,
      height: payload,
    },
  }
}

export const layoutReducer = (
  state = initialLayoutState,
  action: TLayoutAction
): IStoreLayoutState => {
  switch (action.type) {
    case "SET_SIDEBAR":
      return setSidebar(state, action.payload)
    case "TOGGLE_SIDEBAR":
      return toggleSidebar(state)
    case "SET_HEADER":
      return setHeader(state, action.payload)
    default:
      return state
  }
}
