import { createSelector } from "reselect"
import { ECategory, EState, IBuild } from "../../types"
import {
  IStoreCategoryFilters,
  IStoreFiltersState,
  IStoreStateFilters,
} from "../reducers/filters"
import { IStoreState } from "../store"
import {
  filtersCategorySelector,
  filtersQuerySelector,
  filtersStateSelector,
} from "./filters"

// mappers not ideal, but necessary until DB is typed
const categoryMap = {
  balancer: ECategory.BALANCER,
  smelting: ECategory.SMELTING,
  trains: ECategory.TRAINS,
  production: ECategory.PRODUCTION,
  energy: ECategory.ENERGY,
}

const stateMap = {
  early_game: EState.EARLY_GAME,
  mid_game: EState.MID_GAME,
  late_game: EState.LATE_GAME,
}

const buildsSelector = (state: IStoreState) => state.builds.items

const filteredBuildsByState = (
  builds: IBuild[],
  stateFilters: IStoreStateFilters
) => {
  const hasStateFilters = Object.keys(stateFilters).some((k) => {
    // @ts-ignore
    return Boolean(stateFilters[k])
  })

  if (!hasStateFilters) {
    return builds
  }

  return builds.filter((build) => {
    if (build.metadata.state) {
      // @ts-ignore
      return stateFilters[stateMap[build.metadata.state]]
    }
  })
}

const filteredBuildsByCategory = (
  builds: IBuild[],
  categoryFilters: IStoreCategoryFilters
) => {
  const hasCategoryFilters = Object.keys(categoryFilters).some((k) => {
    // @ts-ignore
    return Boolean(categoryFilters[k])
  })

  if (!hasCategoryFilters) {
    return builds
  }

  return builds.filter((build) => {
    if (build.metadata.categories.length) {
      return build.metadata.categories.some((category) => {
        // @ts-ignore
        return categoryFilters[categoryMap[category]]
      })
    }
  })
}

const filteredBuildsByQuery = (
  builds: IBuild[],
  query: IStoreFiltersState["query"]
) => {
  if (!query.trim()) {
    return builds
  }

  return builds.filter((build) => {
    const queryToLower = query.trim().toLowerCase()
    const nameToLower = build.name.toLowerCase()
    return nameToLower.includes(queryToLower)
  })
}

export const filteredBuildsSelector = createSelector(
  buildsSelector,
  filtersQuerySelector,
  filtersStateSelector,
  filtersCategorySelector,
  (builds, filtersQuery, filtersState, filtersCategory) => {
    let filteredBuilds = builds

    filteredBuilds = filteredBuildsByQuery(filteredBuilds, filtersQuery)
    filteredBuilds = filteredBuildsByState(filteredBuilds, filtersState)
    filteredBuilds = filteredBuildsByCategory(filteredBuilds, filtersCategory)

    return filteredBuilds
  }
)