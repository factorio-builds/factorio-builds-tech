import { GetServerSideProps, NextPage } from "next"
import UserBuildListPage from "../../components/pages/UserBuildListPage"
import { IUserBuildListPageProps } from "../../components/pages/UserBuildListPage/user-build-list-page.component"
import { wrapper } from "../../redux/store"
import { axios } from "../../utils/axios"

const UserBuildsPage: NextPage<IUserBuildListPageProps> = (props) => {
  return <UserBuildListPage builds={props.builds} />
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  async (ctx) => {
    const { user } = ctx.params!

    if (!user) {
      return { props: {} }
    }

    const data = await axios
      .get(`/users/${user}/builds`)
      .then((response) => response.data)
      .catch((err) => {
        console.error(err)
      })

    const deserializedData = JSON.parse(JSON.stringify(data))

    return {
      props: deserializedData,
    }
  }
)

export default UserBuildsPage
