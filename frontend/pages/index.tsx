import { GetServerSideProps, NextPage } from "next"
import BuildListPage from "../components/pages/BuildListPage"
import { wrapper } from "../redux/store"
import { ApiSearchBuild, SearchResponse } from "../types"
import { IThinBuild } from "../types/models"
import { axios } from "../utils/axios"

const IndexPage: NextPage = () => {
  return <BuildListPage />
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  async (ctx) => {
    const searchResults = await axios
      .get<ApiSearchBuild>("/builds", {
        params: {
          sort_field: ctx.store.getState().filters.sort.toLowerCase(),
          sort_direction: "asc",
        },
      })
      .then((response) => response.data)
      .catch((err) => {
        console.error(err)
      })

    // const deserializedSearchResults = JSON.parse(JSON.stringify(searchResults))
    const deserializedSearchResults: SearchResponse<IThinBuild> = JSON.parse(
      JSON.stringify(searchResults)
    )

    ctx.store.dispatch({
      type: "SEARCH_BUILDS_SUCCESS",
      payload: {
        builds: deserializedSearchResults.builds,
        current_count: deserializedSearchResults.current_count,
        total_count: deserializedSearchResults.total_count,
        processingTimeMs: 5,
      },
    })

    return { props: {} }
  }
)

export default IndexPage
