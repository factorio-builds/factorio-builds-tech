import axios from "axios"
import { Action } from "redux"
import { ThunkAction } from "redux-thunk"
import { ApiSeachBuild, EFilterType, SearchResponse } from "../../types"
import { IThinBuild } from "../../types/models"
import { IPayloadAction, IStoreState } from "../store"

export interface IStoreSearchState {
  current_count: number
  total_count: number
  builds: IThinBuild[]
  processingTimeMs: number
}

const initialSearchState: IStoreSearchState = {
  current_count: 0,
  total_count: 0,
  builds: [],
  processingTimeMs: 0,
}

type TSearchBuildsAction = Action<"SEARCH_BUILDS">
type TSearchBuildsSuccessAction = IPayloadAction<
  "SEARCH_BUILDS_SUCCESS",
  SearchResponse<IThinBuild>
>

export type TSearchAction = TSearchBuildsAction | TSearchBuildsSuccessAction

export const searchBuildsAsync = (): ThunkAction<
  void,
  IStoreState,
  unknown,
  Action
> => {
  const mapFilters = (state: IStoreState, type: EFilterType): string =>
    Object.entries(state.filters[type])
      .filter(([_, value]) => value)
      .map(([key]) => key)
      .join(",")

  return async function (dispatch, getState) {
    return (
      axios
        // .get<ApiSeachBuild>("/builds", {
        .get("/builds", {
          baseURL: "https://api.local.factorio.tech/",
          params: {
            q: getState().filters.query || undefined,
            state: mapFilters(getState(), EFilterType.STATE) || undefined,
            categories:
              mapFilters(getState(), EFilterType.CATEGORY) || undefined,
          },
        })
        .then((response) => response.data)
        .then((data) => {
          // if (response.data.success) {
          dispatch({
            type: "SEARCH_BUILDS_SUCCESS",
            payload: {
              current_count: data.current_count,
              total_count: data.total_count,
              builds: data.builds,
              processingTimeMs: 5,
            },
          })
          // }
        })
    )
  }
}

const searchBuildsSucess = (
  state: IStoreSearchState,
  payload: TSearchBuildsSuccessAction["payload"]
) => {
  return {
    ...state,
    current_count: payload.current_count,
    total_count: payload.total_count,
    builds: payload.builds,
    processingTimeMs: 5,
  }
}

export const searchReducer = (
  state = initialSearchState,
  action: TSearchAction
): IStoreSearchState => {
  switch (action.type) {
    case "SEARCH_BUILDS_SUCCESS":
      return searchBuildsSucess(state, action.payload)
    default:
      return state
  }
}
