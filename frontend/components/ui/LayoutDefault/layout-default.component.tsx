import React, { ReactNode } from "react"
import Container from "../Container"
import Layout from "../Layout"
import Links from "../Links"
import * as SC from "./layout-default.styles"

interface ILayoutProps {
  children?: ReactNode
  title?: string
}

const LayoutDefault: React.FC<ILayoutProps> = ({ children, title }) => {
  return (
    <Layout title={title}>
      <SC.ContentWrapper>
        <SC.BodyWrapper>
          <SC.Content>{children}</SC.Content>
        </SC.BodyWrapper>

        <SC.Footer>
          <Container size="medium">
            <Links orientation="horizontal" />
          </Container>
        </SC.Footer>
      </SC.ContentWrapper>
    </Layout>
  )
}

export default LayoutDefault
