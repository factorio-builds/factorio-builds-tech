import { GetServerSideProps } from "next"

import { IBuild } from "../../types"
import Layout from "../../components/Layout"
import ListDetailBuild from "../../components/ListDetailBuild"

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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
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
