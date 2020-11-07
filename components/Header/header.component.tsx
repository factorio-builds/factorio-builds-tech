import React from "react"
import Link from "next/link"
import Container from "../Container"
import * as SC from "./header.styles"

function Header(): JSX.Element {
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
          <Link href="/login">
            <SC.InnerLink>Login</SC.InnerLink>
          </Link>
        </SC.StyledStacker>
      </Container>
    </SC.HeaderWrapper>
  )
}

export default Header
