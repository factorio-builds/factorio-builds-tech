import { GetServerSideProps } from "next"
import Link from "next/link"

import { IBuild } from "../../types"
import Layout from "../../components/Layout"
import ListBuild from "../../components/ListBuild"
import { initializeStore } from "../../redux/store"

interface IBuildsIndexPageProps {
  items: IBuild[]
}

const BuildsIndexPage: React.FC<IBuildsIndexPageProps> = ({ items }) => (
  <Layout title="Builds List | Next.js + TypeScript Example">
    <h1>Builds List</h1>
    <p>You are currently on: /builds</p>
    <ListBuild items={items} />
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
)

export const getServerSideProps: GetServerSideProps = async () => {
  const reduxStore = initializeStore()
  const { dispatch } = reduxStore

  const builds: IBuild[] = await fetch(
    "http://localhost:3000/api/build"
  ).then((res) => res.json())

  dispatch({
    type: "SET_BUILDS",
    payload: builds,
  })

  return { props: { items: builds } }
}

export default BuildsIndexPage
