import { EFilterType } from "../../types"
import { IStoreState } from "../store"

export const filtersQuerySelector = (state: IStoreState) => state.filters.query
export const filtersStateSelector = (state: IStoreState) =>
  state.filters[EFilterType.STATE]
export const filtersCategorySelector = (state: IStoreState) =>
  state.filters[EFilterType.CATEGORY]
