import React from "react"
import { useSelector } from "react-redux"
import { filteredBuildsSelector } from "../../../redux/selectors/builds"
import { IStoreState } from "../../../redux/store"
import BuildCardList from "../../ui/BuildCardList"
import FilterList from "../../ui/FilterList"
import Layout from "../../ui/Layout"
import Search from "../../ui/Search"
import Stacker from "../../ui/Stacker"

function BuildListPage(): JSX.Element {
  const { filteredBuilds, sort } = useSelector((store: IStoreState) => ({
    filteredBuilds: filteredBuildsSelector(store),
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
        items={filteredBuilds.builds}
        count={filteredBuilds.count}
        totalCount={filteredBuilds.totalCount}
        lookupTime={filteredBuilds.lookupTime}
        sort={sort}
      />
    </Layout>
  )
}

export default BuildListPage
