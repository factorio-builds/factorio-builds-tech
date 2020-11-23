import { GetServerSideProps, NextPage } from "next"
import { IsNull, Not } from "typeorm"
import { Build } from "../db/entities/build.entity"
import { BuildRepository } from "../db/repository/build.repository"
import BuildListPage from "../pages-components/BuildListPage"
import { wrapper } from "../redux/store"
import { decodeBlueprint, isBook } from "../utils/blueprint"

const IndexPage: NextPage = () => {
  return <BuildListPage />
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  async (ctx) => {
    const buildRepository = await BuildRepository()
    const builds = await buildRepository
      .find({ image: Not(IsNull()) })
      .catch((error) => {
        console.error(error)
        throw new Error("Cannot find build data")
      })

    const deserializedBuilds: Build[] = JSON.parse(JSON.stringify(builds))

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
