import { GetServerSideProps } from "next"
import Layout from "../../components/Layout"
import { User } from "../../db/entities/user.entity"
import { mockedUsers } from "../../utils/mock-users-data"

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
    const user = mockedUsers.find((data) => data.id === id)
    return { props: { user } }
  } catch (err) {
    return { props: { errors: err.message } }
  }
}
