import { GetServerSideProps, NextPage } from "next"
import BuildListPage from "../components/pages/BuildListPage"
import { TStore, wrapper } from "../redux/store"
import { ApiSearchBuild, SearchResponse } from "../types"
import { IThinBuild } from "../types/models"
import { axios } from "../utils/axios"

const IndexPage: NextPage = () => {
  return <BuildListPage />
}

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store: TStore) => async () => {
    const sort = store.getState().filters.sort
    const searchResults = await axios
      .get<ApiSearchBuild>("/builds", {
        params: {
          sort_field: sort.type.toLowerCase(),
          sort_direction: sort.direction.toLowerCase(),
        },
      })
      .then((response) => response.data)
      .catch((err) => {
        console.error(err)
      })

    const deserializedSearchResults: SearchResponse<IThinBuild> = JSON.parse(
      JSON.stringify(searchResults)
    )

    store.dispatch({
      type: "SEARCH_BUILDS_SUCCESS",
      payload: {
        builds: deserializedSearchResults.builds,
        current_count: deserializedSearchResults.current_count,
        total_count: deserializedSearchResults.total_count,
      },
    })

    return { props: {} }
  })

export default IndexPage
