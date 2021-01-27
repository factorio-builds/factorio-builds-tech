import { GetServerSideProps, NextPage } from "next"
import Layout from "../../components/ui/Layout"
import { IUser } from "../../types/models"

interface IUsersPageProps {
  user?: IUser
  errors?: string
}

const UsersPage: NextPage<IUsersPageProps> = ({ user, errors }) => {
  if (errors || !user) {
    return (
      <Layout title="Error">
        <p>
          <span style={{ color: "red" }}>Error:</span> {errors}
        </p>
      </Layout>
    )
  }

  return <Layout title={user.username}>{user.username}</Layout>
}

export default UsersPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = params?.id
    const user = { id: id }

    // const userRepository = await UserRepository()
    // const user = await userRepository.findOne(id as string).catch((error) => {
    //   console.error(error)
    //   throw new Error("Cannot find user data")
    // })

    if (!user) throw new Error("User not found")

    return { props: { user } }
  } catch (err) {
    return { props: { errors: err.message } }
  }
}
