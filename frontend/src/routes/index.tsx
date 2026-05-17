import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import BuildListPage from "../components/pages/BuildListPage"
import { useAppDispatch, useAppSelector } from "../redux/store"
import type { ApiSearchBuild } from "../types"
import { axios } from "../utils/axios"

export const Route = createFileRoute("/")({
  loader: async () => {
    // Seed the initial build list via SSR. The store dispatch happens
    // client-side via the inner component effect — TanStack loaders run on
    // the server but the redux store lives per request in the root.
    try {
      const res = await axios.get<ApiSearchBuild>("/builds", {
        params: { sort_field: "title", sort_direction: "asc" },
      })
      return { initialSearch: res.data }
    } catch (err) {
      console.error("Failed to load initial builds", err)
      return { initialSearch: null }
    }
  },
  component: HomeRoute,
})

function HomeRoute() {
  const data = Route.useLoaderData()
  const dispatch = useAppDispatch()
  const hasBuilds = useAppSelector(
    (s) => s.search.builds && s.search.builds.length > 0
  )

  useEffect(() => {
    if (data.initialSearch && !hasBuilds) {
      dispatch({
        type: "SEARCH_BUILDS_SUCCESS",
        payload: {
          builds: data.initialSearch.builds,
          current_count: data.initialSearch.current_count,
          total_count: data.initialSearch.total_count,
        },
      })
    }
  }, [data.initialSearch, hasBuilds, dispatch])

  return <BuildListPage />
}
