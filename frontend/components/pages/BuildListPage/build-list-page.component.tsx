import React from "react"
import { useSelector } from "react-redux"
import { IStoreState } from "../../../redux/store"
import BuildCardList from "../../ui/BuildCardList"
import FilterList from "../../ui/FilterList"
import Layout from "../../ui/Layout"
import Search from "../../ui/Search"
import Stacker from "../../ui/Stacker"

function BuildListPage(): JSX.Element {
  const { search, sort } = useSelector((store: IStoreState) => ({
    search: store.search,
    sort: store.filters.sort,
  }))

  return (
    <Layout
      sidebar={
        <Stacker gutter={32}>
          <Search />
          <FilterList />
        </Stacker>
      }
    >
      <BuildCardList
        items={search.builds}
        count={search.current_count}
        totalCount={search.total_count}
        lookupTime={search.processingTimeMs}
        sort={sort}
      />
    </Layout>
  )
}

export default BuildListPage
