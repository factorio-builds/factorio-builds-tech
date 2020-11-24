import React from "react"
import { useSelector } from "react-redux"
import Link from "next/link"
import { IStoreState } from "../../../redux/store"
import Container from "../Container"
import * as SC from "./header.styles"

function Header(): JSX.Element {
  const user = useSelector((state: IStoreState) => state.auth.user)

  return (
    <SC.HeaderWrapper>
      <Container>
        <Link href="/">
          <SC.StyledLogo />
        </Link>

        <SC.StyledStacker orientation="horizontal" gutter={18}>
          <Link href="/build/create">
            <SC.CreateBuildButton>Add a build</SC.CreateBuildButton>
          </Link>

          {!user && (
            <Link href="/login">
              <SC.InnerLink>Login</SC.InnerLink>
            </Link>
          )}

          {user && (
            <Link href="/logout">
              <SC.InnerLink>Logout</SC.InnerLink>
            </Link>
          )}

          {user && <span>{user.name}</span>}
        </SC.StyledStacker>
      </Container>
    </SC.HeaderWrapper>
  )
}

export default Header
