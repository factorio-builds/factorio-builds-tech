import { createFileRoute } from "@tanstack/react-router"
import BuildPage from "../../../components/pages/BuildPage"
import LayoutDefault from "../../../components/ui/LayoutDefault"
import { useRouter } from "../../../lib/router"
import type { IFullBuild } from "../../../types/models"
import { http } from "../../../utils/http"

export const Route = createFileRoute("/$user/$slug/")({
  loader: async ({ params }) => {
    const { user, slug } = params
    try {
      const res = await http.get<IFullBuild>(`/builds/${user}/${slug}`)
      if (!res.data) throw new Error("Build not found")
      return { build: res.data, errors: undefined }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      return { build: undefined, errors: message }
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.build
          ? `Factorio Builds | ${loaderData.build.title}`
          : "Factorio Builds | Error",
      },
    ],
  }),
  component: BuildDetailRoute,
})

function BuildDetailRoute() {
  const { build, errors } = Route.useLoaderData()
  const router = useRouter()

  if (errors || !build) {
    return (
      <LayoutDefault title="Error">
        <p>
          <span style={{ color: "red" }}>Error:</span> {errors}
        </p>
      </LayoutDefault>
    )
  }

  return <BuildPage build={build} router={router} />
}
