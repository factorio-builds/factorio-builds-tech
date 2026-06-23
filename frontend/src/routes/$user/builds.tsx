import { createFileRoute } from "@tanstack/react-router"
import UserBuildListPage from "../../components/pages/UserBuildListPage"
import type { IUserBuildListPageProps } from "../../components/pages/UserBuildListPage/user-build-list-page.component"
import { http } from "../../utils/http"

export const Route = createFileRoute("/$user/builds")({
  loader: async ({ params }) => {
    const { user } = params
    try {
      const res = await http.get<IUserBuildListPageProps>(
        `/users/${user}/builds`
      )
      return { builds: res.data.builds }
    } catch (err) {
      console.error(err)
      return { builds: [] as IUserBuildListPageProps["builds"] }
    }
  },
  head: ({ params }) => ({
    meta: [{ title: `Factorio Builds | ${params.user}` }],
  }),
  component: UserBuildsRoute,
})

function UserBuildsRoute() {
  const { builds } = Route.useLoaderData()
  return <UserBuildListPage builds={builds} />
}
