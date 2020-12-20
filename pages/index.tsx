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
      .get<ApiSeachBuild>("http://localhost:3000/api/search/build")
      .then((response) => {
        if (response.data.success) {
          return response.data.result
        }
      })

    const deserializedSearchResults: SearchResponse<IIndexedBuild> = JSON.parse(
      JSON.stringify(searchResults)
    )

    ctx.store.dispatch({
      type: "SEARCH_BUILDS_SUCCESS",
      payload: deserializedSearchResults,
    })

    return { props: {} }
  }
)

export default IndexPage
