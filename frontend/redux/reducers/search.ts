import { Action } from "redux"
import { ThunkAction } from "redux-thunk"
import { SearchResponse } from "../../types"
import { IThinBuild } from "../../types/models"
import { axios } from "../../utils/axios"
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
  const mapTagKeys = (state: IStoreState): Record<string, string> => {
    return state.filters.tags
      .filter((tag) => tag.isSelected)
      .map((tag) => `/${tag.group}/${tag.name}`)
      .reduce((acc, curr, index) => {
        return {
          ...acc,
          [`tags[${index}]`]: curr,
        }
      }, {})
  }

  return async function (dispatch, getState) {
    const state = getState()

    return axios
      .get("/builds", {
        params: {
          q: getState().filters.query || undefined,
          ...mapTagKeys(state),
          sort_field: state.filters.sort.toLowerCase(),
          sort_direction: "asc",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        dispatch({
          type: "SEARCH_BUILDS_SUCCESS",
          payload: {
            current_count: data.current_count,
            total_count: data.total_count,
            builds: data.builds,
            processingTimeMs: 5,
          },
        })
      })
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
