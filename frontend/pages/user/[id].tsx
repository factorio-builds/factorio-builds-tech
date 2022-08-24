import { GetServerSideProps, NextPage } from "next"
import LayoutDefault from "../../components/ui/LayoutDefault"
import { IUser } from "../../types/models"

interface IUsersPageProps {
  user?: IUser
  errors?: string
}

const UsersPage: NextPage<IUsersPageProps> = ({ user, errors }) => {
  if (errors || !user) {
    return (
      <LayoutDefault title="Error">
        <p>
          <span style={{ color: "red" }}>Error:</span> {errors}
        </p>
      </LayoutDefault>
    )
  }

  return <LayoutDefault title={user.username}>{user.username}</LayoutDefault>
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
  } catch (err: any) {
    return { props: { errors: err.message } }
  }
}
