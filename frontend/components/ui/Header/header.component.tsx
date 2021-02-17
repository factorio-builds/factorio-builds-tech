import React from "react"
import { useSelector } from "react-redux"
import Link from "next/link"
import { IStoreState } from "../../../redux/store"
import Container from "../Container"
import UserDropdown from "../UserDropdown"
import * as SC from "./header.styles"

function Header(): JSX.Element {
  const user = useSelector((state: IStoreState) => state.auth.user)

  return (
    <SC.HeaderWrapper>
      <Container>
        <Link href="/">
          <a>
            <SC.StyledLogo />
          </a>
        </Link>

        <SC.StyledStacker orientation="horizontal" gutter={18}>
          {user && (
            <Link href="/build/create">
              <SC.CreateBuildButton>Add a build</SC.CreateBuildButton>
            </Link>
          )}

          {!user && (
            <Link href="/api/login">
              <SC.InnerLink>Login</SC.InnerLink>
            </Link>
          )}

          {user && <UserDropdown user={user} />}
        </SC.StyledStacker>
      </Container>
    </SC.HeaderWrapper>
  )
}

export default Header
