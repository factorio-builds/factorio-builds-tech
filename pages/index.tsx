import { useSelector } from "react-redux"
import { IncomingMessage } from "http"
import { GetServerSideProps, NextPage } from "next"
import BuildCardList from "../components/BuildCardList"
import BuildListLookupStats from "../components/BuildListLookupStats"
import Filters from "../components/Filters"
import Layout from "../components/Layout"
import SearchInput from "../components/SearchInput"
import { connectDB } from "../db"
import { Build } from "../db/entities/build.entity"
import { filteredBuildsSelector } from "../redux/selectors/builds"
import { IStoreState, wrapper } from "../redux/store"
import { IBuild } from "../types"
import { decodeBlueprint, isBook } from "../utils/blueprint"

const IndexPage: NextPage = () => {
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

// TODO: properly extend IncomingMessage
interface ExtendedReq extends IncomingMessage {
  session: {
    passport: {
      user: {
        name: string
        discordId: string
        id: string
        createdAt: string
        updatedAt: string
      }
    }
  }
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  async (ctx) => {
    // TODO: properly extend IncomingMessage
    const req = ctx.req as ExtendedReq

    if (req && req.session.passport) {
      // user is logged in
      console.log(req.session)
      console.log(req.session.passport.user)
    }

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

    ctx.store.dispatch({
      type: "SET_BUILDS",
      payload: tempBuilds,
    })

    return { props: {} }
  }
)

export default IndexPage
