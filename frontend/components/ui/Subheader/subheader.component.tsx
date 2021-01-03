import React from "react"
import Container from "../Container"
import Stacker from "../Stacker"
import * as SC from "./subheader.styles"

interface ISubheader {
  title: JSX.Element | string
  subtitle?: JSX.Element
}

function Subheader(props: ISubheader): JSX.Element {
  return (
    <SC.HeaderWrapper>
      <Container>
        <Stacker gutter={4}>
          <SC.Title>{props.title}</SC.Title>
          <SC.Subtitle>{props.subtitle}</SC.Subtitle>
        </Stacker>
      </Container>
    </SC.HeaderWrapper>
  )
}

export default Subheader
