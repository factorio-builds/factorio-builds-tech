import { GetStaticProps } from "next"
import Link from "next/link"

import { IBuild } from "../../types"
import { mockedBuilds } from "../../utils/mock-builds-data"
import Layout from "../../components/Layout"
import ListBuild from "../../components/ListBuild"

interface IProps {
  items: IBuild[]
}

const WithStaticProps: React.FC<IProps> = ({ items }) => (
  <Layout title="Builds List | Next.js + TypeScript Example">
    <h1>Builds List</h1>
    <p>
      Example fetching data from inside <code>getStaticProps()</code>.
    </p>
    <p>You are currently on: /builds</p>
    <ListBuild items={items} />
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
)

export const getStaticProps: GetStaticProps = async () => {
  // Example for including static props in a Next.js function component page.
  // Don't forget to include the respective types for any props passed into
  // the component.
  const items: IBuild[] = mockedBuilds
  return { props: { items } }
}

export default WithStaticProps
