import { GetStaticProps } from "next"
import { useSelector } from "react-redux"
import Layout from "../components/Layout"
import BuildCardList from "../components/BuildCardList"
import { IStoreState } from "../redux/store"
import { IBuild } from "../types"

const IndexPage: React.FC = () => {
  const builds = useSelector((store: IStoreState) => store.builds.items)
  return (
    <Layout>
      <BuildCardList items={builds} />
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const builds: IBuild[] = await fetch(
    "http://localhost:3000/api/builds"
  ).then((res) => res.json())

  return {
    props: {
      initialReduxState: {
        builds: {
          items: builds,
        },
      },
    },
  }
}

export default IndexPage
