import { GetServerSideProps } from "next"
import Link from "next/link"

import { IUser } from "../../types"
import { mockedUsers } from "../../utils/mock-users-data"
import Layout from "../../components/Layout"
import List from "../../components/List"

interface IUsersIndexPage {
  items: IUser[]
}

const UsersIndexPage = ({ items }: IUsersIndexPage) => (
  <Layout title="Users">
    <h1>Users List</h1>
    <p>You are currently on: /users</p>
    <List items={items} />
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
)

export const getServerSideProps: GetServerSideProps = async () => {
  const items: IUser[] = mockedUsers
  return { props: { items } }
}

export default UsersIndexPage
