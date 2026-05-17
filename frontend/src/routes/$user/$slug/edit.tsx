import { createFileRoute } from "@tanstack/react-router"
import BuildFormPage from "../../../components/pages/BuildFormPage"
import LayoutDefault from "../../../components/ui/LayoutDefault"
import type { IFullBuild } from "../../../types/models"
import { axios } from "../../../utils/axios"

export const Route = createFileRoute("/$user/$slug/edit")({
  loader: async ({ params }) => {
    const { user, slug } = params
    try {
      const res = await axios.get<IFullBuild>(`/builds/${user}/${slug}`)
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
          ? `Factorio Builds | Edit ${loaderData.build.title}`
          : "Factorio Builds | Error",
      },
    ],
  }),
  component: BuildEditRoute,
})

function BuildEditRoute() {
  const { build, errors } = Route.useLoaderData()

  if (errors || !build) {
    return (
      <LayoutDefault title="Error">
        <p>
          <span style={{ color: "red" }}>Error:</span> {errors}
        </p>
      </LayoutDefault>
    )
  }

  return <BuildFormPage type="EDIT" build={build} />
}
