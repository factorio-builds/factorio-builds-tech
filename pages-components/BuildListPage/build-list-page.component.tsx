import React from "react"
import { useSelector } from "react-redux"
import BuildCardList from "../../components/BuildCardList"
import BuildListLookupStats from "../../components/BuildListLookupStats"
import Filters from "../../components/Filters"
import Layout from "../../components/Layout"
import SearchInput from "../../components/SearchInput"
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
          <Filters />
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
