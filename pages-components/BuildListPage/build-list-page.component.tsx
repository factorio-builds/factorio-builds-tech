import React from "react"
import { useSelector } from "react-redux"
import BuildCardList from "../../components/ui/BuildCardList"
import BuildListLookupStats from "../../components/ui/BuildListLookupStats"
import FilterList from "../../components/ui/FilterList"
import Layout from "../../components/ui/Layout"
import SearchInput from "../../components/ui/SearchInput"
import { filteredBuildsSelector } from "../../redux/selectors/builds"
import { IStoreState } from "../../redux/store"

function BuildListPage(): JSX.Element {
  const filteredBuilds = useSelector((store: IStoreState) =>
    filteredBuildsSelector(store)
  )

  return (
    <Layout
      sidebar={
        <>
          <SearchInput />
          <FilterList />
        </>
      }
    >
      <BuildListLookupStats
        count={filteredBuilds.count}
        totalCount={filteredBuilds.totalCount}
        lookupTime={filteredBuilds.lookupTime}
      />
      <BuildCardList items={filteredBuilds.builds} />
    </Layout>
  )
}

export default BuildListPage
