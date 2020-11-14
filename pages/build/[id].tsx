import { GetServerSideProps } from "next"
import Layout from "../../components/Layout"
import BuildPage from "../../components/BuildPage"
import { BuildRepository } from "../../db/repository/build.repository"
import { Build } from "../../db/entities/build.entity"

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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = params?.id

    const buildRepository = await BuildRepository()
    const build = await buildRepository.findOne(id as string).catch((error) => {
      console.error(error)
      throw new Error("Cannot find build data")
    })

    if (!build) throw new Error("Build not found")

    return {
      props: { build: JSON.parse(JSON.stringify(build)) },
    }
  } catch (err) {
    return { props: { errors: err.message } }
  }
}
