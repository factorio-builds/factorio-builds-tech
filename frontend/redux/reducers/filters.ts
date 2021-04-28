import { ESortDirection, ESortType } from "../../types"
import { IPayloadAction } from "../store"

interface IBeltGroup {
  group: "belt"
  name:
    | "balancer"
    | "prioritizer"
    | "tap"
    | "transport belt (yellow)"
    | "fast transport belt (red)"
    | "express transport belt (blue)"
  isSelected: boolean
}

interface IStateGroup {
  group: "state"
  name: "early game" | "mid game" | "late game" | "end game (megabase)"
  isSelected: boolean
}

interface IMetaGroup {
  group: "meta"
  name: "beaconized" | "tileable" | "compact" | "marathon" | "storage" | "inputs are marked" | "ups optimized"
  isSelected: boolean
}

interface IPowerGroup {
  group: "power"
  name: "nuclear" | "kovarex enrichment" | "solar" | "steam" | "accumulator"
  isSelected: boolean
}

interface IProductionGroup {
  group: "production"
  name:
    | "oil processing"
    | "coal liquification"
    | "electronic circuit (green)"
    | "advanced circuit (red)"
    | "processing unit (blue)"
    | "batteries"
    | "rocket parts"
    | "science"
    | "research (labs)"
    | "belts"
    | "smelting"
    | "mining"
    | "uranium"
    | "plastic"
    | "modules"
    | "mall (make everything)"
    | "inserters"
    | "guns and ammo"
    | "robots"
    | "other"
    | "belt based"
    | "logistic (bot) based"
  isSelected: boolean
}

interface ITrainGroup {
  group: "train"
  name:
    | "loading station"
    | "unloading station"
    | "pax"
    | "junction"
    | "roundabout"
    | "crossing"
    | "stacker"
    | "track"
    | "left-hand-drive"
    | "right-hand-drive"
  isSelected: boolean
}

interface ICircuitGroup {
  group: "circuit"
  name: "indicator" | "counter"
  isSelected: boolean
}

export type ITag = IBeltGroup | IStateGroup | IMetaGroup | IPowerGroup | IProductionGroup | ITrainGroup | ICircuitGroup

export interface IStoreFiltersState {
  query: string
  sort: {
    type: ESortType
    direction: ESortDirection
  }
  tags: ITag[]
}

const initialFiltersState: IStoreFiltersState = {
  query: "",
  sort: {
    type: ESortType.TITLE,
    direction: ESortDirection.ASC,
  },
  // prettier-ignore
  tags: [
    { group: "belt", name: "balancer", isSelected: false },
    { group: "belt", name: "prioritizer", isSelected: false },
    { group: "belt", name: "tap", isSelected: false },
    { group: "belt", name: "transport belt (yellow)", isSelected: false },
    { group: "belt", name: "fast transport belt (red)", isSelected: false },
    { group: "belt", name: "express transport belt (blue)", isSelected: false },
    { group: "state", name: "early game", isSelected: false },
    { group: "state", name: "mid game", isSelected: false },
    { group: "state", name: "late game", isSelected: false },
    { group: "state", name: "end game (megabase)", isSelected: false },
    { group: "meta", name: "beaconized", isSelected: false },
    { group: "meta", name: "tileable", isSelected: false },
    { group: "meta", name: "compact", isSelected: false },
    { group: "meta", name: "marathon", isSelected: false },
    { group: "meta", name: "storage", isSelected: false },
    { group: "meta", name: "inputs are marked", isSelected: false },
    { group: "meta", name: "ups optimized", isSelected: false },
    { group: "power", name: "nuclear", isSelected: false },
    { group: "power", name: "kovarex enrichment", isSelected: false },
    { group: "power", name: "solar", isSelected: false },
    { group: "power", name: "steam", isSelected: false },
    { group: "power", name: "accumulator", isSelected: false },
    { group: "production", name: "oil processing", isSelected: false },
    { group: "production", name: "coal liquification", isSelected: false },
    { group: "production", name: "electronic circuit (green)", isSelected: false },
    { group: "production", name: "advanced circuit (red)", isSelected: false },
    { group: "production", name: "processing unit (blue)", isSelected: false },
    { group: "production", name: "batteries", isSelected: false },
    { group: "production", name: "rocket parts", isSelected: false },
    { group: "production", name: "science", isSelected: false },
    { group: "production", name: "research (labs)", isSelected: false },
    { group: "production", name: "belts", isSelected: false },
    { group: "production", name: "smelting", isSelected: false },
    { group: "production", name: "mining", isSelected: false },
    { group: "production", name: "uranium", isSelected: false },
    { group: "production", name: "plastic", isSelected: false },
    { group: "production", name: "modules", isSelected: false },
    { group: "production", name: "mall (make everything)", isSelected: false },
    { group: "production", name: "inserters", isSelected: false },
    { group: "production", name: "guns and ammo", isSelected: false },
    { group: "production", name: "robots", isSelected: false },
    { group: "production", name: "other", isSelected: false },
    { group: "production", name: "belt based", isSelected: false },
    { group: "production", name: "logistic (bot) based", isSelected: false },
    { group: "train", name: "loading station", isSelected: false },
    { group: "train", name: "unloading station", isSelected: false },
    { group: "train", name: "pax", isSelected: false },
    { group: "train", name: "junction", isSelected: false },
    { group: "train", name: "roundabout", isSelected: false },
    { group: "train", name: "crossing", isSelected: false },
    { group: "train", name: "stacker", isSelected: false },
    { group: "train", name: "track", isSelected: false },
    { group: "train", name: "left-hand-drive", isSelected: false },
    { group: "train", name: "right-hand-drive", isSelected: false },
    { group: "circuit", name: "indicator", isSelected: false },
    { group: "circuit", name: "counter", isSelected: false },
  ],
}

type TFilterPayload = Omit<ITag, "isSelected">
type TSortPayload = {
  type: ESortType
  direction: ESortDirection
}

type TSetQueryAction = IPayloadAction<"SET_QUERY", string>
type TSetSortAction = IPayloadAction<"SET_SORT", TSortPayload>
type TToggleFilterAction = IPayloadAction<"TOGGLE_FILTER", TFilterPayload>

export type TFiltersAction = TSetQueryAction | TSetSortAction | TToggleFilterAction

const setQuery = (state: IStoreFiltersState, payload: TSetQueryAction["payload"]): IStoreFiltersState => {
  return {
    ...state,
    query: payload,
  }
}

const setSort = (state: IStoreFiltersState, payload: TSetSortAction["payload"]): IStoreFiltersState => {
  return {
    ...state,
    sort: {
      type: payload.type,
      direction: payload.direction,
    },
  }
}

const toggleFilter = (state: IStoreFiltersState, payload: TToggleFilterAction["payload"]): IStoreFiltersState => {
  return {
    ...state,
    tags: state.tags.map((tag) => {
      if (tag.group === payload.group && tag.name === payload.name) {
        return { ...tag, isSelected: !tag.isSelected }
      }
      return tag
    }),
  }
}

export const filtersReducer = (state = initialFiltersState, action: TFiltersAction): IStoreFiltersState => {
  switch (action.type) {
    case "SET_QUERY":
      return setQuery(state, action.payload)
    case "SET_SORT":
      return setSort(state, action.payload)
    case "TOGGLE_FILTER":
      return toggleFilter(state, action.payload)
    default:
      return state
  }
}
