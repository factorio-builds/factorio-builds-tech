import { useQuery } from "@tanstack/react-query"
import { useAppSelector } from "../redux/store"
import type { IStoreFiltersState } from "../redux/reducers/filters"
import type { SearchResponse } from "../types"
import type { IThinBuild } from "../types/models"
import { http } from "../utils/http"

export interface BuildsSearchParams {
  q: string | undefined
  tags: string[]
  sort_field: string
  sort_direction: string
}

export function toBuildsSearchParams(
  filters: IStoreFiltersState
): BuildsSearchParams {
  return {
    q: filters.query || undefined,
    tags: filters.tags
      .filter((tag) => tag.isSelected)
      .map((tag) => `/${tag.group}/${tag.name}`),
    sort_field: filters.sort.type.toLowerCase(),
    sort_direction: filters.sort.direction.toLowerCase(),
  }
}

export function buildsSearchQuery(params: BuildsSearchParams) {
  return {
    queryKey: ["builds", "search", params] as const,
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const res = await http.get<SearchResponse<IThinBuild>>("/builds", {
        params: { ...params },
        signal,
      })
      return res.data
    },
  }
}

export function useBuildsSearch() {
  const filters = useAppSelector((s) => s.filters)
  return useQuery(buildsSearchQuery(toBuildsSearchParams(filters)))
}
