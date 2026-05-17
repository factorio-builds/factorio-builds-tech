import React from "react"
import { useBuildsSearch } from "../../../hooks/useBuildsSearch"
import { useAppSelector } from "../../../redux/store"
import BuildCardList from "../../ui/BuildCardList"
import FilterList from "../../ui/FilterList"
import LayoutSidebar from "../../ui/LayoutSidebar"
import Links from "../../ui/Links"
import Search from "../../ui/Search"
import Stacker from "../../ui/Stacker"

function BuildListPage(): JSX.Element {
  const sort = useAppSelector((store) => store.filters.sort)
  const { data } = useBuildsSearch()

  return (
    <LayoutSidebar
      sidebar={
        <Stacker gutter={32}>
          <Search />
          <FilterList />
          <Links orientation="vertical" />
        </Stacker>
      }
    >
      <BuildCardList
        items={data?.builds ?? []}
        count={data?.current_count ?? 0}
        totalCount={data?.total_count ?? 0}
        sort={sort}
      />
    </LayoutSidebar>
  )
}

export default BuildListPage
