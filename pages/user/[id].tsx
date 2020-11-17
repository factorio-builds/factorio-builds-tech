import { GetServerSideProps } from "next"
import Layout from "../../components/Layout"
import { User } from "../../db/entities/user.entity"
import { UserRepository } from "../../db/repository/user.repository"

interface IUsersPageProps {
  user?: User
  errors?: string
}

const UsersPage = ({ user, errors }: IUsersPageProps) => {
  if (errors || !user) {
    return (
      <Layout title="Error">
        <p>
          <span style={{ color: "red" }}>Error:</span> {errors}
        </p>
      </Layout>
    )
  }

  return <Layout title={user.name}>{user.name}</Layout>
}

export default UsersPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = params?.id

    const userRepository = await UserRepository()
    const user = await userRepository.findOne(id as string).catch((error) => {
      console.error(error)
      throw new Error("Cannot find user data")
    })

    if (!user) throw new Error("User not found")

    return { props: { user } }
  } catch (err) {
    return { props: { errors: err.message } }
  }
}
