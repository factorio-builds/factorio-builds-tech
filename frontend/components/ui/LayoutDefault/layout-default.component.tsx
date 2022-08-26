import React, { ReactNode } from "react"
import Container from "../Container"
import Layout from "../Layout"
import Links from "../Links"
import * as S from "./layout-default.styles"

interface ILayoutProps {
  children?: ReactNode
  title?: string
}

const LayoutDefault: React.FC<ILayoutProps> = ({ children, title }) => {
  return (
    <Layout title={title}>
      <S.ContentWrapper>
        <S.BodyWrapper>
          <S.Content>{children}</S.Content>
        </S.BodyWrapper>

        <S.Footer>
          <Container size="medium">
            <Links orientation="horizontal" />
          </Container>
        </S.Footer>
      </S.ContentWrapper>
    </Layout>
  )
}

export default LayoutDefault
