import { GetServerSideProps, NextPage } from "next"
import { WithRouterProps } from "next/dist/client/with-router"
import { withRouter } from "next/router"
import BuildPage from "../../components/pages/BuildPage"
import LayoutDefault from "../../components/ui/LayoutDefault"
import { IFullBuild } from "../../types/models"
import { axios } from "../../utils/axios"

interface IBuildsPageProps extends WithRouterProps {
  build?: IFullBuild
  errors?: string
}

const BuildsPage: NextPage<IBuildsPageProps> = ({ build, errors, router }) => {
  if (errors || !build) {
    return (
      <LayoutDefault title="Error">
        <p>
          <span style={{ color: "red" }}>Error:</span> {errors}
        </p>
      </LayoutDefault>
    )
  }

  return <BuildPage build={build} router={router} />
}

export default withRouter(BuildsPage)

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
