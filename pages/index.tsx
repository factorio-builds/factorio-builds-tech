import { GetServerSideProps, NextPage } from "next"
import { Build } from "../db/entities/build.entity"
import { BuildRepository } from "../db/repository/build.repository"
import BuildListPage from "../pages-components/BuildListPage"
import { wrapper } from "../redux/store"

const IndexPage: NextPage = () => {
  return <BuildListPage />
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  async (ctx) => {
    const buildRepository = await BuildRepository()
    const builds = await buildRepository.createQueryBuilder("build").select([
      "build.id",
      "build.name",
      "build.metadata",
      "build.image"
    ])
      .where("build.image IS NOT NULL")
      .getMany()
      .catch((error) => {
        console.error(error)
        throw new Error("Cannot find build data")
      })

    const deserializedBuilds: Build[] = JSON.parse(JSON.stringify(builds))

    ctx.store.dispatch({
      type: "SET_BUILDS",
      payload: deserializedBuilds,
    })

    return { props: {} }
  }
)

export default IndexPage
