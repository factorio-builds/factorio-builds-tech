import { GetServerSideProps } from "next"
import Link from "next/link"
import Layout from "../../components/Layout"
import { User } from "../../db/entities/user.entity"
import { mockedUsers } from "../../utils/mock-users-data"

interface IUsersIndexPage {
  users: User[]
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
  const users: User[] = mockedUsers
  return { props: { users } }
}

export default UsersIndexPage
