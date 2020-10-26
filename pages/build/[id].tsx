import { GetServerSideProps } from "next"
import { connectDB } from "../../db"
import { Build } from "../../db/entities/build.entity"
import { IBuildWithJson } from "../../types"
import Layout from "../../components/Layout"
import BuildPage from "../../components/BuildPage"

interface IBuildsPageProps {
  build?: IBuildWithJson
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

    const connection = await connectDB()

    const buildsRepository = connection!.getRepository(Build)
    const build = await buildsRepository
      .findOne(id as string)
      // TODO: reproduce with TypeORM
      // .findByPk(req.query.id, {
      //   // @ts-ignore
      //   include: [{ model: db.user, as: "owner" }],
      // })
      .catch((error) => {
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
