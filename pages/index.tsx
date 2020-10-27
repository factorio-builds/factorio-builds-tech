import { useSelector } from "react-redux"
import { GetServerSideProps } from "next"
import BuildCardList from "../components/BuildCardList"
import BuildListLookupStats from "../components/BuildListLookupStats"
import Filters from "../components/Filters"
import Layout from "../components/Layout"
import SearchInput from "../components/SearchInput"
import { connectDB } from "../db"
import { Build } from "../db/entities/build.entity"
import { filteredBuildsSelector } from "../redux/selectors/builds"
import { initializeStore, IStoreState } from "../redux/store"
import { IBuild } from "../types"
import { decodeBlueprint, isBook } from "../utils/blueprint"

const IndexPage: React.FC = () => {
  const filteredBuilds = useSelector((store: IStoreState) =>
    filteredBuildsSelector(store)
  )

  return (
    <Layout
      sidebar={
        <>
          <SearchInput />
          <Filters />
        </>
      }
    >
      <BuildListLookupStats
        count={filteredBuilds.count}
        totalCount={filteredBuilds.totalCount}
        lookupTime={filteredBuilds.lookupTime}
      />
      <BuildCardList items={filteredBuilds.builds} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const reduxStore = initializeStore()
  const { dispatch } = reduxStore

  const connection = await connectDB()

  const buildsRepository = connection!.getRepository(Build)
  const builds = await buildsRepository.find().catch((error) => {
    console.error(error)
    throw new Error("Cannot find build data")
  })

  const deserializedBuilds: IBuild[] = JSON.parse(JSON.stringify(builds))

  // temp until part of data structure/metadata
  const tempBuilds = deserializedBuilds.map((build) => {
    const decodedBlueprint = decodeBlueprint(build.blueprint)
    return {
      ...build,
      isBook: isBook(decodedBlueprint),
    }
  })

  console.log(tempBuilds)

  dispatch({
    type: "SET_BUILDS",
    payload: tempBuilds,
  })

  return { props: { initialReduxState: reduxStore.getState() } }
}

export default IndexPage
