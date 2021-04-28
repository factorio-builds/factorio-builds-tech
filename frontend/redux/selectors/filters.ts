import { IStoreFiltersState } from "../reducers/filters"
import { IStoreState } from "../store"

export const filtersQuerySelector = (state: IStoreState): IStoreFiltersState["query"] => {
  return state.filters.query
}

export const filtersTagsSelector = (state: IStoreState): IStoreFiltersState["tags"] => {
  return state.filters.tags
}
