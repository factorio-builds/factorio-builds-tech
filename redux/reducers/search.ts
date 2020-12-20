import axios from "axios"
import { Action } from "redux"
import { ThunkAction } from "redux-thunk"
import {
  ApiSeachBuild,
  EFilterType,
  IIndexedBuild,
  SearchResponse,
} from "../../types"
import { IPayloadAction, IStoreState } from "../store"

export interface IStoreSearchState {
  nbTotal: number
  nbHits: number
  hits: IIndexedBuild[]
  processingTimeMs: number
}

const initialSearchState: IStoreSearchState = {
  nbTotal: 0,
  nbHits: 0,
  hits: [],
  processingTimeMs: 0,
}

type TSearchBuildsAction = Action<"SEARCH_BUILDS">
type TSearchBuildsSuccessAction = IPayloadAction<
  "SEARCH_BUILDS_SUCCESS",
  SearchResponse<IIndexedBuild>
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
    return axios
      .get<ApiSeachBuild>("http://localhost:3000/api/search/build", {
        params: {
          q: getState().filters.query || undefined,
          state: mapFilters(getState(), EFilterType.STATE) || undefined,
          categories: mapFilters(getState(), EFilterType.CATEGORY) || undefined,
        },
      })
      .then((response) => {
        if (response.data.success) {
          dispatch({
            type: "SEARCH_BUILDS_SUCCESS",
            payload: response.data.result,
          })
        }
      })
  }
}

const searchBuildsSucess = (
  state: IStoreSearchState,
  payload: TSearchBuildsSuccessAction["payload"]
) => {
  return {
    ...state,
    nbTotal: payload.nbTotal,
    nbHits: payload.nbHits,
    hits: payload.hits,
    processingTimeMs: payload.processingTimeMs,
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
