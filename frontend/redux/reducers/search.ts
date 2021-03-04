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
}

const initialSearchState: IStoreSearchState = {
  current_count: 0,
  total_count: 0,
  builds: [],
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
  return async function (dispatch, getState) {
    const state = getState()

    return axios
      .get("/builds", {
        params: {
          q: getState().filters.query || undefined,
          tags: state.filters.tags
            .filter((tag) => tag.isSelected)
            .map((tag) => `/${tag.group}/${tag.name}`),
          sort_field: state.filters.sort.type.toLowerCase(),
          sort_direction: state.filters.sort.direction.toLowerCase(),
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
          },
        })
      })
  }
}

const searchBuildsSuccess = (
  state: IStoreSearchState,
  payload: TSearchBuildsSuccessAction["payload"]
) => {
  return {
    ...state,
    current_count: payload.current_count,
    total_count: payload.total_count,
    builds: payload.builds,
  }
}

export const searchReducer = (
  state = initialSearchState,
  action: TSearchAction
): IStoreSearchState => {
  switch (action.type) {
    case "SEARCH_BUILDS_SUCCESS":
      return searchBuildsSuccess(state, action.payload)
    default:
      return state
  }
}
