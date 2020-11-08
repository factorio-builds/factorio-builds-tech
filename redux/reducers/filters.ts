import { ECategory, EFilterType, EState } from "../../types"
import { IPayloadAction } from "../store"

export interface IStoreStateFilters {
  [EState.EARLY_GAME]: boolean
  [EState.MID_GAME]: boolean
  [EState.LATE_GAME]: boolean
}

export interface IStoreCategoryFilters {
  [ECategory.BALANCER]: boolean
  [ECategory.SMELTING]: boolean
  [ECategory.TRAINS]: boolean
  [ECategory.PRODUCTION]: boolean
  [ECategory.ENERGY]: boolean
}

export interface IStoreFiltersState {
  query: string
  [EFilterType.STATE]: IStoreStateFilters
  [EFilterType.CATEGORY]: IStoreCategoryFilters
}

const initialFiltersState: IStoreFiltersState = {
  query: "",
  [EFilterType.STATE]: {
    [EState.EARLY_GAME]: false,
    [EState.MID_GAME]: false,
    [EState.LATE_GAME]: false,
  },
  [EFilterType.CATEGORY]: {
    [ECategory.BALANCER]: false,
    [ECategory.SMELTING]: false,
    [ECategory.TRAINS]: false,
    [ECategory.PRODUCTION]: false,
    [ECategory.ENERGY]: false,
  },
}

type TFilterPayload =
  | { type: EFilterType.STATE; name: EState }
  | { type: EFilterType.CATEGORY; name: ECategory }

type TSetQueryAction = IPayloadAction<"SET_QUERY", string>
type TToggleFilterAction = IPayloadAction<"TOGGLE_FILTER", TFilterPayload>
type TToggleFilterStateAction = IPayloadAction<"TOGGLE_FILTER_STATE", EState>
type TToggleCategoryStateAction = IPayloadAction<
  "TOGGLE_FILTER_CATEGORY",
  ECategory
>

export type TFiltersAction =
  | TSetQueryAction
  | TToggleFilterAction
  | TToggleFilterStateAction
  | TToggleCategoryStateAction

const setQuery = (
  state: IStoreFiltersState,
  payload: TSetQueryAction["payload"]
): IStoreFiltersState => {
  return {
    ...state,
    query: payload,
  }
}

const toggleFilter = (
  state: IStoreFiltersState,
  payload: TToggleFilterAction["payload"]
): IStoreFiltersState => {
  if (payload.type === EFilterType.STATE) {
    return toggleFilterState(state, payload.name)
  }

  if (payload.type === EFilterType.CATEGORY) {
    return toggleFilterCategory(state, payload.name)
  }

  return state
}

const toggleFilterState = (
  state: IStoreFiltersState,
  payload: TToggleFilterStateAction["payload"]
): IStoreFiltersState => {
  return {
    ...state,
    [EFilterType.STATE]: {
      ...state[EFilterType.STATE],
      [payload]: !state[EFilterType.STATE][payload],
    },
  }
}

const toggleFilterCategory = (
  state: IStoreFiltersState,
  payload: TToggleCategoryStateAction["payload"]
): IStoreFiltersState => {
  return {
    ...state,
    [EFilterType.CATEGORY]: {
      ...state[EFilterType.CATEGORY],
      [payload]: !state[EFilterType.CATEGORY][payload],
    },
  }
}

export const filtersReducer = (
  state = initialFiltersState,
  action: TFiltersAction
): IStoreFiltersState => {
  switch (action.type) {
    case "SET_QUERY":
      return setQuery(state, action.payload)
    case "TOGGLE_FILTER":
      return toggleFilter(state, action.payload)
    case "TOGGLE_FILTER_STATE":
      return toggleFilterState(state, action.payload)
    case "TOGGLE_FILTER_CATEGORY":
      return toggleFilterCategory(state, action.payload)
    default:
      return state
  }
}
