import { createFileRoute } from "@tanstack/react-router"
import LayoutDefault from "../../components/ui/LayoutDefault"
import type { IUser } from "../../types/models"

export const Route = createFileRoute("/user/$id")({
  loader: ({ params }) => {
    // Server-side User repository is not wired up — the Next baseline returned
    // a stub with just the id. Mirror that behaviour pending a real endpoint.
    return { user: { id: params.id } as Partial<IUser>, errors: undefined }
  },
  head: ({ params }) => ({
    meta: [{ title: `Factorio Builds | ${params.id}` }],
  }),
  component: UserRoute,
})

function UserRoute() {
  const { user, errors } = Route.useLoaderData()
  if (errors || !user) {
    return (
      <LayoutDefault title="Error">
        <p>
          <span style={{ color: "red" }}>Error:</span> {errors}
        </p>
      </LayoutDefault>
    )
  }
  return (
    <LayoutDefault title={user.username ?? String(user.id)}>
      {user.username ?? String(user.id)}
    </LayoutDefault>
  )
}
