import { GetServerSideProps } from "next"
import Link from "next/link"
import Layout from "../../components/ui/Layout"
import { User } from "../../db/entities/user.entity"
import { UserRepository } from "../../db/repository/user.repository"

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
  const userRepository = await UserRepository()
  const users = await userRepository.find().catch((error) => {
    console.error(error)
    throw new Error("Cannot find user data")
  })

  return { props: { users } }
}

export default UsersIndexPage
