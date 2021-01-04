import React from "react"
import { IThinBuild } from "../../../types"
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
      {props.builds.map((build) => (
        <div key={build.slug}>{build.title}</div>
      ))}
    </Layout>
  )
}

export default UserBuildListPage
