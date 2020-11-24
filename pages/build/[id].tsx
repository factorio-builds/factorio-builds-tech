import { GetServerSideProps } from "next"
import Layout from "../../components/ui/Layout"
import BuildPage from "../../pages-components/BuildPage"
import { BuildRepository } from "../../db/repository/build.repository"
import { Build } from "../../db/entities/build.entity"
import { viewBuildIncrementUseCase } from "../../server/usecase/build.usecase"

interface IBuildsPageProps {
  build?: Build
  errors?: string
}

const BuildsPage = ({ build, errors }: IBuildsPageProps) => {
  if (errors || !build) {
    return (
      <Layout title="Error">
        <p>
          <span style={{ color: "red" }}>Error:</span> {errors}
        </p>
      </Layout>
    )
  }

  return <BuildPage build={build} />
}

export default BuildsPage

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  try {
    const id = params?.id

    const buildRepository = await BuildRepository()
    const build = await buildRepository.findOne(id as string).catch((error) => {
      console.error(error)
      throw new Error("Cannot find build data")
    })

    if (!build) throw new Error("Build not found")

    await viewBuildIncrementUseCase({
      build,
      ip:
        (req.headers["x-forwarded-for"] as string) ||
        req.connection.remoteAddress ||
        "0.0.0.0",
    })

    return {
      props: { build: JSON.parse(JSON.stringify(build)) },
    }
  } catch (err) {
    return { props: { errors: err.message } }
  }
}
