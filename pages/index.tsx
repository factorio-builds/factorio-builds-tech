import { GetServerSideProps } from "next"
import { useSelector } from "react-redux"
import Layout from "../components/Layout"
import BuildCardList from "../components/BuildCardList"
import Filters from "../components/Filters"
import SearchInput from "../components/SearchInput"
import { initializeStore, IStoreState } from "../redux/store"
import { IBuild } from "../types"
import db from "../db/models"

const IndexPage: React.FC = () => {
  const builds = useSelector((store: IStoreState) => store.builds.items)
  return (
    <Layout
      sidebar={
        <>
          <SearchInput />
          <Filters />
        </>
      }
    >
      <BuildCardList items={builds} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const reduxStore = initializeStore()
  const { dispatch } = reduxStore

  // @ts-ignore
  const builds: IBuild[] = await db.build
    .findAll({
      attributes: ["id", "owner_id", "name", "metadata"],
    })
    // @ts-ignore
    .catch((error) => {
      console.error(error)
      throw new Error("Cannot find build data")
    })

  dispatch({
    type: "SET_BUILDS",
    payload: JSON.parse(JSON.stringify(builds)),
  })

  return { props: { initialReduxState: reduxStore.getState() } }
}

export default IndexPage
