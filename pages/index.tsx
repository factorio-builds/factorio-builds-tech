import { GetStaticProps } from "next"
import { useSelector } from "react-redux"
import Layout from "../components/Layout"
import ListBuild from "../components/ListBuild"
import { IStoreState } from "../store"
import { IBuild } from "../types"
import { mockedBuilds } from "../utils/mock-builds-data"

const IndexPage: React.FC = () => {
  const builds = useSelector((store: IStoreState) => store.builds)
  return (
    <Layout>
      <ListBuild items={builds} />
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const builds: IBuild[] = mockedBuilds
  return {
    props: {
      initialReduxState: {
        builds,
      },
    },
  }
}

export default IndexPage
