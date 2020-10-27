import { GetServerSideProps } from "next"
import Link from "next/link"
import Layout from "../../components/Layout"
import { IUser } from "../../types"
import { mockedUsers } from "../../utils/mock-users-data"

interface IUsersIndexPage {
  users: IUser[]
}

const UsersIndexPage = ({ users }: IUsersIndexPage) => (
  <Layout title="Users">
    <h1>Users List</h1>
    <p>You are currently on: /users</p>
    {users.map((user, index) => (
      <div key={index}>{user.name}</div>
    ))}
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
)

export const getServerSideProps: GetServerSideProps = async () => {
  const users: IUser[] = mockedUsers
  return { props: { users } }
}

export default UsersIndexPage
