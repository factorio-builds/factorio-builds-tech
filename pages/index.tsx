import { GetStaticProps } from "next"
import { useSelector } from "react-redux"
import Layout from "../components/Layout"
import BuildCardList from "../components/BuildCardList"
import { IStoreState } from "../redux/store"
import { IBuild } from "../types"
import { mockedBuilds } from "../utils/mock-builds-data"

const IndexPage: React.FC = () => {
  const builds = useSelector((store: IStoreState) => store.builds.items)
  return (
    <Layout>
      <BuildCardList items={builds} />
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const builds: IBuild[] = mockedBuilds
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
