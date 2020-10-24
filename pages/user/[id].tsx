import { GetServerSideProps } from "next"

import { IUser } from "../../types"
import { mockedUsers } from "../../utils/mock-users-data"
import Layout from "../../components/Layout"
import ListDetail from "../../components/ListDetail"

interface IUsersPageProps {
  item?: IUser
  errors?: string
}

const UsersPage = ({ item, errors }: IUsersPageProps) => {
  if (errors) {
    return (
      <Layout title="Error">
        <p>
          <span style={{ color: "red" }}>Error:</span> {errors}
        </p>
      </Layout>
    )
  }

  return (
    <Layout
      title={`${
        item ? item.name : "User Detail"
      } | Next.js + TypeScript Example`}
    >
      {item && <ListDetail item={item} />}
    </Layout>
  )
}

export default UsersPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = params?.id
    const item = mockedUsers.find((data) => data.id === id)
    return { props: { item } }
  } catch (err) {
    return { props: { errors: err.message } }
  }
}
