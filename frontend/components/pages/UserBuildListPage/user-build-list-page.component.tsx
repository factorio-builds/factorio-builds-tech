import React from "react"
import { IThinBuild } from "../../../types/models"
import BuildList from "../../ui/BuildList"
import FilterList from "../../ui/FilterList"
import Layout from "../../ui/Layout"
import Search from "../../ui/Search"
import Stacker from "../../ui/Stacker"

export interface IUserBuildListPageProps {
  builds: IThinBuild[]
}

function UserBuildListPage(props: IUserBuildListPageProps): JSX.Element {
  return (
    <Layout
      sidebar={
        <Stacker gutter={32}>
          <Search />
          <FilterList />
        </Stacker>
      }
    >
      <BuildList items={props.builds} />
    </Layout>
  )
}

export default UserBuildListPage
