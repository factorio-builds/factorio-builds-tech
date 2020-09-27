import { GetServerSideProps } from "next"
import db from "../../db/models"
import { ECategory, IBuild, EState, IUser, IMetadata } from "../../types"
import Layout from "../../components/Layout"
import BuildPage from "../../components/BuildPage"
import { isEmptyChildren } from "formik"

interface IBuildsPageProps {
  build?: IBuild
  errors?: string
}

const BuildsPage = ({ build, errors }: IBuildsPageProps) => {
  if (errors || !build) {
    return (
      <Layout title="Error | Next.js + TypeScript Example">
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

    // @ts-ignore
    const build = await db.build
      .findByPk(id, {
        // @ts-ignore
        include: [{ model: db.user, as: "owner" }],
      })

      // @ts-ignore
      .catch((error) => {
        console.error(error)
        throw new Error("Cannot find build data")
      })

    if (!build) throw new Error("Build not found")

    // Let's fix up the types so we're returning exactly what we've been asked for from a typescript standpoint
    const metadata: IMetadata = {
      tileable: build.metadata.tileable,
      area: build.metadata.area,
      state: EState.EARLY_GAME,
      categories: [ECategory.BALANCER],
    }

    const owner: IUser = {
      id: build.owner.id,
      name: build.owner.name,
    }

    const buildInt: IBuild = {
      id: build.id,
      name: build.name,
      blueprint: build.blueprint,
      createdAt: build.createdAt.toISOString(),
      updatedAt: build.updatedAt.toISOString(),
      metadata: metadata,
      owner: owner,
    }

    const response: IBuildsPageProps = {
      build: buildInt,
    }

    return {
      props: response,
    }
  } catch (err) {
    return { props: { errors: err.message } }
  }
}
