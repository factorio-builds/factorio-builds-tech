import { createFileRoute } from "@tanstack/react-router"
import Link from "../../lib/Link"
import LayoutDefault from "../../components/ui/LayoutDefault"
import type { IThinUser } from "../../types/models"

// In the Next baseline this route crashed with `users.map is not a function`
// because the API didn't return an array (see .context/baseline/NOTES.md #1).
// We render an empty list rather than crashing.

export const Route = createFileRoute("/user/")({
  loader: async () => ({ users: [] as IThinUser[] }),
  head: () => ({ meta: [{ title: "Factorio Builds | Users" }] }),
  component: UsersIndexRoute,
})

function UsersIndexRoute(): JSX.Element {
  const { users } = Route.useLoaderData()
  return (
    <LayoutDefault title="Users">
      <h1>Users List</h1>
      <p>You are currently on: /users</p>
      {users.map((user, index) => (
        <div key={index}>{user.username}</div>
      ))}
      <p>
        <Link href="/">Go home</Link>
      </p>
    </LayoutDefault>
  )
}
