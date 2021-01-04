import axios from "axios"
import { GetServerSideProps } from "next"
import BuildPage from "../../components/pages/BuildPage"
import Layout from "../../components/ui/Layout"
import { IFullBuild } from "../../types/models"
// import { viewBuildIncrementUseCase } from "../../server/usecase/build.usecase"

interface IBuildsPageProps {
  build?: IFullBuild
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
    const { user, slug } = params!

    const build = await axios
      .get(`/builds/${user}/${slug}`, {
        baseURL: "https://api.local.factorio.tech",
      })
      .then((response) => response.data)
      .catch((err) => {
        console.error(err)
      })

    if (!build) throw new Error("Build not found")

    // await viewBuildIncrementUseCase({
    //   build,
    //   ip:
    //     (req.headers["x-forwarded-for"] as string) ||
    //     req.connection.remoteAddress ||
    //     "0.0.0.0",
    // })

    return {
      props: { build: JSON.parse(JSON.stringify(build)) },
    }
  } catch (err) {
    return { props: { errors: err.message } }
  }
}
