import { GetServerSideProps } from "next"
import { useSelector } from "react-redux"
import Layout from "../components/Layout"
import BuildCardList from "../components/BuildCardList"
import { initializeStore, IStoreState } from "../redux/store"
import { IBuild } from "../types"

const IndexPage: React.FC = () => {
  const builds = useSelector((store: IStoreState) => store.builds.items)
  return (
    <Layout>
      <BuildCardList items={builds} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const reduxStore = initializeStore()
  const { dispatch } = reduxStore

  const builds: IBuild[] = await fetch(
    "http://localhost:3000/api/builds"
  ).then((res) => res.json())

  dispatch({
    type: "SET_BUILDS",
    payload: builds,
  })

  return { props: { initialReduxState: reduxStore.getState() } }
}

export default IndexPage
