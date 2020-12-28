import axios from "axios"
import { GetServerSideProps, NextPage } from "next"
import BuildListPage from "../components/pages/BuildListPage"
import { wrapper } from "../redux/store"
import { ApiSeachBuild, IIndexedBuild, SearchResponse } from "../types"

const IndexPage: NextPage = () => {
  return <BuildListPage />
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  async (ctx) => {
    const searchResults = await axios
      .get<ApiSeachBuild>("/builds", {
        baseURL: "http://localhost:4001",
      })
      .then((response) => response.data)
    // .then((response) => {
    //   console.log(response)
    //   if (response.data.success) {
    //     return response.data.result
    //   }
    // })

    const deserializedSearchResults = JSON.parse(JSON.stringify(searchResults))
    // const deserializedSearchResults: SearchResponse<IIndexedBuild> = JSON.parse(
    //   JSON.stringify(searchResults)
    // )

    ctx.store.dispatch({
      type: "SEARCH_BUILDS_SUCCESS",
      payload: {
        hits: deserializedSearchResults.builds,
        nbHits: deserializedSearchResults.builds.length,
        nbTotal: deserializedSearchResults.builds.length,
        processingTimeMs: 5,
      },
    })

    return { props: {} }
  }
)

export default IndexPage
