import { GetServerSideProps } from "next"
import Link from "next/link"
import Layout from "../../components/ui/Layout"
import { IThinUser } from "../../types/models"

interface IUsersIndexPage {
  users: IThinUser[]
}

const UsersIndexPage = ({ users }: IUsersIndexPage): JSX.Element => (
  <Layout title="Users">
    <h1>Users List</h1>
    <p>You are currently on: /users</p>
    {users.map((user, index) => (
      <div key={index}>{user.username}</div>
    ))}
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
)

export const getServerSideProps: GetServerSideProps = async () => {
  const users = {}

  // const userRepository = await UserRepository()
  // const users = await userRepository.find().catch((error) => {
  //   console.error(error)
  //   throw new Error("Cannot find user data")
  // })

  return { props: { users } }
}

export default UsersIndexPage
