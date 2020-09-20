import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import ListBuild from "../components/ListBuild"
import { IBuild } from "../types"
import { mockedBuilds } from "../utils/mock-builds-data"

interface IIndexPageProps {
  builds: IBuild[]
}

const IndexPage: React.FC<IIndexPageProps> = (props) => {
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <ListBuild items={props.builds} />
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const builds: IBuild[] = mockedBuilds
  return { props: { builds } }
}

export default IndexPage
