import { GetServerSideProps, NextPage } from "next"
import BuildPage from "../../components/pages/BuildPage"
import Layout from "../../components/ui/Layout"
import { IFullBuild } from "../../types/models"
import { axios } from "../../utils/axios"

interface IBuildsPageProps {
  build?: IFullBuild
  errors?: string
}

const BuildsPage: NextPage<IBuildsPageProps> = ({ build, errors }) => {
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
  const { user, slug } = params!

  try {
    const build = await axios
      .get(`/builds/${user}/${slug}`)
      .then((response) => response.data)
      .catch((err) => {
        console.error(err)
      })

    if (!build) throw new Error("Build not found")

    return {
      props: { build: JSON.parse(JSON.stringify(build)) },
    }
  } catch (err) {
    return { props: { errors: err.message } }
  }
}
