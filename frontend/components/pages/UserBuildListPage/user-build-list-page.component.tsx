import React from "react"
import { IThinBuild } from "../../../types/models"
import BuildList from "../../ui/BuildList"
import Container from "../../ui/Container"
import Layout from "../../ui/Layout"

export interface IUserBuildListPageProps {
  builds: IThinBuild[]
}

function UserBuildListPage(props: IUserBuildListPageProps): JSX.Element {
  return (
    <Layout>
      <Container size="medium">
        <BuildList items={props.builds} />
      </Container>
    </Layout>
  )
}

export default UserBuildListPage
