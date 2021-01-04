import axios from "axios"
import { GetServerSideProps, NextPage } from "next"
import BuildListPage from "../components/pages/BuildListPage"
import { wrapper } from "../redux/store"
import { ApiSeachBuild, IThinBuild, SearchResponse } from "../types"

const IndexPage: NextPage = () => {
  return <BuildListPage />
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  async (ctx) => {
    const searchResults = await axios
      .get<ApiSeachBuild>("/builds", {
        baseURL: "https://api.local.factorio.tech",
      })
      .then((response) => response.data)
      .catch((err) => {
        console.error(err)
      })

    // console.log(searchResults)

    // const deserializedSearchResults = JSON.parse(JSON.stringify(searchResults))
    const deserializedSearchResults: SearchResponse<IThinBuild> = JSON.parse(
      JSON.stringify(searchResults)
    )

    console.log(deserializedSearchResults)

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
