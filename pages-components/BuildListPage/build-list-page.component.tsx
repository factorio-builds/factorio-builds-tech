import React from "react"
import { useSelector } from "react-redux"
import BuildCardList from "../../components/ui/BuildCardList"
import FilterList from "../../components/ui/FilterList"
import Layout from "../../components/ui/Layout"
import Search from "../../components/ui/Search"
import Stacker from "../../components/ui/Stacker"
import { filteredBuildsSelector } from "../../redux/selectors/builds"
import { IStoreState } from "../../redux/store"

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
