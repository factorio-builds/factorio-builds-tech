import { GetStaticProps, GetStaticPaths } from "next"

import { IBuild } from "../../types"
import { mockedBuilds } from "../../utils/mock-builds-data"
import Layout from "../../components/Layout"
import ListDetailBuild from "../../components/ListDetailBuild"
import db from "../../db/models"

interface IProps {
  item?: IBuild
  errors?: string
}

const StaticPropsDetail = ({ item, errors }: IProps) => {
  if (errors) {
    return (
      <Layout title="Error | Next.js + TypeScript Example">
        <p>
          <span style={{ color: "red" }}>Error:</span> {errors}
        </p>
      </Layout>
    )
  }

  return (
    <Layout
      title={`${
        item ? item.name : "Build Detail"
      } | Next.js + TypeScript Example`}
    >
      {item && <ListDetailBuild item={item} />}
    </Layout>
  )
}

export default StaticPropsDetail

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    await db.sequelize.authenticate()
    console.log("Connection has been established successfully.")

    const builds = await db.builds
      .findAll({
        attributes: ["id"],
      })
      .catch((error) => {
        console.error(error)
        throw new Error("Cannot find build data")
      })

    // Get the paths we want to pre-render based on users
    const paths = builds.map((build) => ({
      params: { id: build.id },
    }))

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
  } catch (err) {
    throw err
  }
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const id = params?.id

    const item: IBuild = await fetch(
      "http://localhost:3000/api/builds/" + id
    ).then((res) => res.json())

    return { props: { item } }
  } catch (err) {
    return { props: { errors: err.message } }
  }
}
