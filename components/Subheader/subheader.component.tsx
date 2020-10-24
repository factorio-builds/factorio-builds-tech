import React, { ReactNode } from "react"
import Container from "../Container"
import * as SC from "./subheader.styles"

interface ISubheader {
  children: ReactNode
}

function Subheader(props: ISubheader): JSX.Element {
  return (
    <SC.HeaderWrapper>
      <Container direction="row">{props.children}</Container>
    </SC.HeaderWrapper>
  )
}

export default Subheader
