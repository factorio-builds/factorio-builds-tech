import { GetServerSideProps } from "next"

import { IBuild } from "../../types"
import Layout from "../../components/Layout"
import BuildPage from "../../components/BuildPage"

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

    const build: IBuild = await fetch(
      "http://localhost:3000/api/build/" + id
    ).then((res) => res.json())

    if (!build) throw new Error("Build not found")

    return { props: { build } }
  } catch (err) {
    return { props: { errors: err.message } }
  }
}
