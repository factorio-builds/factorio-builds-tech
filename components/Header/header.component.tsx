import React from "react"
import Link from "next/link"
import Container from "../Container"
import * as SC from "./header.styles"

function Header(): JSX.Element {
  return (
    <SC.HeaderWrapper>
      <Container>
        <Link href="/">my blueprints</Link>
        <Link href="/builds/create">
          <SC.CreateBuildButton>Add a build</SC.CreateBuildButton>
        </Link>
      </Container>
    </SC.HeaderWrapper>
  )
}

export default Header
