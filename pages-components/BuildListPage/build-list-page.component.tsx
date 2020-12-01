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
  const filteredBuilds = useSelector((store: IStoreState) =>
    filteredBuildsSelector(store)
  )

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
      />
    </Layout>
  )
}

export default BuildListPage
