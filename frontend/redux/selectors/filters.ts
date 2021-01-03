import { EFilterType } from "../../types"
import {
  IStoreCategoryFilters,
  IStoreFiltersState,
  IStoreStateFilters,
} from "../reducers/filters"
import { IStoreState } from "../store"

export const filtersQuerySelector = (
  state: IStoreState
): IStoreFiltersState["query"] => {
  return state.filters.query
}

export const filtersStateSelector = (
  state: IStoreState
): IStoreStateFilters => {
  return state.filters[EFilterType.STATE]
}

export const filtersCategorySelector = (
  state: IStoreState
): IStoreCategoryFilters => {
  return state.filters[EFilterType.CATEGORY]
}
