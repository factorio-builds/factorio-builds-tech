import React from "react"
import Container from "../Container"
import Stacker from "../Stacker"
import * as S from "./subheader.styles"

interface ISubheader {
  title: JSX.Element | string
  subtitle?: JSX.Element
}

function Subheader(props: ISubheader): JSX.Element {
  return (
    <S.HeaderWrapper>
      <Container>
        <Stacker gutter={4}>
          <S.Title>{props.title}</S.Title>
          <S.Subtitle>{props.subtitle}</S.Subtitle>
        </Stacker>
      </Container>
    </S.HeaderWrapper>
  )
}

export default Subheader
