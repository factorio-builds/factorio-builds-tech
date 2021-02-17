import React, { ReactNode } from "react"
import Head from "next/head"
import Container from "../Container"
import Header from "../Header"
import Sidebar from "../Sidebar"
import * as SC from "./layout.styles"

interface ILayoutProps {
  children?: ReactNode
  sidebar?: ReactNode
  title?: string
  subheader?: ReactNode
  size?: "medium" | "large"
}

const Layout: React.FC<ILayoutProps> = ({
  children,
  sidebar,
  title,
  subheader,
  size = "large",
}) => (
  <>
    <Head>
      <title>{["Factorio Builds", title].filter(Boolean).join(" | ")}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Header />
    {subheader}
    <Container size={size}>
      <SC.BodyWrapper orientation="horizontal" gutter={20}>
        {sidebar && <Sidebar>{sidebar}</Sidebar>}
        <SC.Content>{children}</SC.Content>
      </SC.BodyWrapper>
    </Container>
  </>
)

export default Layout
