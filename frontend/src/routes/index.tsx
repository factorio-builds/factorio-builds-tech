import { createFileRoute } from "@tanstack/react-router"
import BuildListPage from "../components/pages/BuildListPage"
import {
  buildsSearchQuery,
  toBuildsSearchParams,
} from "../hooks/useBuildsSearch"
import { ESortDirection, ESortType } from "../types"

export const Route = createFileRoute("/")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(
      buildsSearchQuery(
        toBuildsSearchParams({
          query: "",
          sort: { type: ESortType.TITLE, direction: ESortDirection.ASC },
          tags: [],
        })
      )
    )
  },
  component: BuildListPage,
})
