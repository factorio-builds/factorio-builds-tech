import React from "react"
import { IThinBuild } from "../../../types/models"
import BuildList from "../../ui/BuildList"
import Layout from "../../ui/Layout"

export interface IUserBuildListPageProps {
  builds: IThinBuild[]
}

function UserBuildListPage(props: IUserBuildListPageProps): JSX.Element {
  return (
    <Layout>
      <BuildList items={props.builds} />
    </Layout>
  )
}

export default UserBuildListPage
