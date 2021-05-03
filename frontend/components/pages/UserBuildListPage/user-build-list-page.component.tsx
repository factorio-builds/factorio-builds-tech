import React from "react"
import { IThinBuild } from "../../../types/models"
import BuildList from "../../ui/BuildList"
import Container from "../../ui/Container"
import LayoutDefault from "../../ui/LayoutDefault"

export interface IUserBuildListPageProps {
  builds: IThinBuild[]
}

function UserBuildListPage(props: IUserBuildListPageProps): JSX.Element {
  return (
    <LayoutDefault>
      <Container size="medium">
        <BuildList items={props.builds} />
      </Container>
    </LayoutDefault>
  )
}

export default UserBuildListPage
