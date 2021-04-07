import { GetServerSideProps, NextPage } from "next"
import Link from "next/link"
import LayoutDefault from "../../components/ui/LayoutDefault"
import { IThinUser } from "../../types/models"

interface IUsersIndexPage {
  users: IThinUser[]
}

const UsersIndexPage: NextPage<IUsersIndexPage> = ({ users }) => (
  <LayoutDefault title="Users">
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
  </LayoutDefault>
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
